"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { api } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5248";

interface Message {
  id?: number;
  content: string;
  senderName: string;
  isFromOperator: boolean;
  sentAt: string;
}

export default function ChatWidget() {
  const t = useTranslations("chat");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const sessionIdRef = useRef<number | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [connected, setConnected] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("chat_session");
    const savedName = localStorage.getItem("chat_name");
    if (savedSession && savedName) {
      sessionIdRef.current = parseInt(savedSession);
      setName(savedName);
      setStarted(true);
    }
  }, []);

  // Load previous messages when session is restored
  useEffect(() => {
    if (started && sessionIdRef.current) {
      api.getChatSessionMessages(sessionIdRef.current)
        .then((msgs) => {
          setMessages(msgs.map((m) => ({
            id: m.id,
            content: m.content,
            senderName: m.senderName,
            isFromOperator: m.isFromOperator,
            sentAt: m.sentAt,
          })));
        })
        .catch(() => {
          // Session may have been closed/deleted — start fresh
          localStorage.removeItem("chat_session");
          sessionIdRef.current = null;
        });
    }
  }, [started]);

  // SignalR connection — one stable connection while started
  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/chat`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    conn.on("ReceiveMessage", (msg: Message) => {
      if (cancelled) return;
      setMessages((prev) => {
        // Dedupe by id if available
        if (msg.id && prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    conn.on("SessionCreated", (newSessionId: number) => {
      if (cancelled) return;
      sessionIdRef.current = newSessionId;
      localStorage.setItem("chat_session", String(newSessionId));
    });

    conn.onreconnected(async () => {
      // Rejoin session group after reconnect
      if (sessionIdRef.current) {
        try { await conn.invoke("JoinSession", sessionIdRef.current); } catch {}
      }
    });

    (async () => {
      try {
        await conn.start();
        if (cancelled) { conn.stop(); return; }
        // Join existing session group if we have one
        if (sessionIdRef.current) {
          await conn.invoke("JoinSession", sessionIdRef.current);
        }
        connectionRef.current = conn;
        if (!cancelled) setConnected(true);
      } catch {
        // React Strict Mode double-mount or network error
      }
    })();

    return () => {
      cancelled = true;
      setConnected(false);
      connectionRef.current = null;
      conn.stop().catch(() => {});
    };
  }, [started]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = useCallback(() => {
    if (!name.trim()) return;
    localStorage.setItem("chat_name", name);
    setStarted(true);
    setMessages([
      {
        content: t("greeting"),
        senderName: "Korvoni Umed",
        isFromOperator: true,
        sentAt: new Date().toISOString(),
      },
    ]);
  }, [name, t]);

  const startAnonymous = useCallback(() => {
    const anonName = t("anonymous") || "Аноним";
    setName(anonName);
    localStorage.setItem("chat_name", anonName);
    setStarted(true);
    setMessages([
      {
        content: t("greeting"),
        senderName: "Korvoni Umed",
        isFromOperator: true,
        sentAt: new Date().toISOString(),
      },
    ]);
  }, [t]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !connectionRef.current) return;

    const text = input;
    setInput("");

    try {
      await connectionRef.current.invoke("SendMessage", {
        content: text,
        senderName: name,
        sessionId: sessionIdRef.current,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }, [input, name]);

  const endChat = useCallback(() => {
    localStorage.removeItem("chat_session");
    localStorage.removeItem("chat_name");
    sessionIdRef.current = null;
    setStarted(false);
    setMessages([]);
    setName("");
    setConnected(false);
    connectionRef.current?.stop().catch(() => {});
    connectionRef.current = null;
  }, []);

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center"
        aria-label={t("title")}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[var(--color-border)] flex flex-col" style={{ height: "28rem" }}>
          {/* Header */}
          <div className="bg-[var(--color-primary)] text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{t("title")}</h4>
              <p className="text-xs text-white/70">Korvoni Umed</p>
            </div>
            {started && (
              <button onClick={endChat} className="text-xs text-white/60 hover:text-white transition-colors" title="Завершить чат">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>

          {!started ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
              <p className="text-sm text-[var(--color-text-light)]">{t("namePrompt")}</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startChat()}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                placeholder={t("namePrompt")}
              />
              <button onClick={startChat} className="btn-primary text-sm w-full">
                {t("start")}
              </button>
              <button onClick={startAnonymous} className="w-full text-sm py-2 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-2">
                {t("startAnonymous")}
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={msg.id || `local-${i}`}
                    className={`flex ${msg.isFromOperator ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                        msg.isFromOperator
                          ? "bg-gray-100 text-[var(--color-text)]"
                          : "bg-[var(--color-primary)] text-white"
                      }`}
                    >
                      <p className="text-xs font-medium mb-1 opacity-70">{msg.senderName}</p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[var(--color-border)] p-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={t("placeholder")}
                  disabled={!connected}
                  className="flex-1 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!connected}
                  className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg text-sm hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                >
                  {t("send")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
