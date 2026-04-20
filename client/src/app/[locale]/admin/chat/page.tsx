"use client";

import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { api, type ChatSession, type ChatMessage } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5248";
const sourceLabels: Record<number, string> = { 0: "Сайт", 1: "Telegram" };

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    api.getChatSessions().then(setSessions).catch(console.error);

    const token = localStorage.getItem("token");
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/chat`, {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    conn.on("NewMessage", (msg: ChatMessage) => {
      if (cancelled) return;
      setMessages((prev) => {
        if (prev.some((m) => m.chatSessionId === msg.chatSessionId)) {
          return [...prev, msg];
        }
        return prev;
      });
      api.getChatSessions().then((s) => { if (!cancelled) setSessions(s); });

      if (!msg.isFromOperator && Notification.permission === "granted") {
        new Notification("Новое сообщение", { body: `${msg.senderName}: ${msg.content}` });
      }
    });

    conn.on("SessionUpdated", () => {
      if (!cancelled) api.getChatSessions().then((s) => { if (!cancelled) setSessions(s); });
    });

    (async () => {
      try {
        await conn.start();
        if (cancelled) { conn.stop(); return; }
        await conn.invoke("JoinOperators");
        if (!cancelled) setConnection(conn);
      } catch {
        // Silently handle stop-during-negotiation (React Strict Mode double-mount)
      }
    })();

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      cancelled = true;
      conn.stop().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (activeSession) {
      api.getChatMessages(activeSession).then(setMessages).catch(console.error);
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!input.trim() || !connection || !activeSession) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      await connection.invoke("SendOperatorMessage", activeSession, input, user.fullName || "Operator");
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const closeSession = async (id: number) => {
    await api.closeChatSession(id);
    api.getChatSessions().then(setSessions);
    if (activeSession === id) {
      setActiveSession(null);
      setMessages([]);
    }
  };

  const activeSessionData = sessions.find((s) => s.id === activeSession);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Чат</h1>
        <p className="text-sm text-gray-500 mt-1">Общение с посетителями</p>
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 14rem)" }}>
        {/* Sessions list */}
        <div className="w-80 shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Сессии ({sessions.length})</p>
          </div>
          {sessions.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="w-10 h-10 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm text-gray-400">Нет активных сессий</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSession(s.id)}
                className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeSession === s.id ? "bg-[var(--color-primary)]/5 border-l-2 border-l-[var(--color-primary)]" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{s.visitorName}</p>
                    <p className="text-[11px] text-gray-400">{sourceLabels[s.source]}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {s.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                        {s.unreadCount}
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); closeSession(s.id); }}
                      className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Закрыть"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {s.lastMessage && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{s.lastMessage.content}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">Выберите сессию для ответа</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                  {activeSessionData?.visitorName?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activeSessionData?.visitorName}</p>
                  <p className="text-[11px] text-gray-400">{sourceLabels[activeSessionData?.source ?? 0]}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages
                  .filter((m) => m.chatSessionId === activeSession)
                  .map((m, i) => (
                    <div key={i} className={`flex ${m.isFromOperator ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-3.5 py-2.5 rounded-xl text-sm ${
                        m.isFromOperator
                          ? "bg-[var(--color-primary)] text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}>
                        <p className="text-[11px] font-medium mb-0.5 opacity-70">{m.senderName}</p>
                        <p className="leading-relaxed">{m.content}</p>
                        <p className="text-[10px] mt-1 opacity-50">
                          {new Date(m.sentAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-100 p-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Напишите ответ..."
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                />
                <button
                  onClick={sendReply}
                  className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Отправить
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
