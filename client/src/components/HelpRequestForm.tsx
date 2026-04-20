"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/api";

export default function HelpRequestForm() {
  const t = useTranslations("request");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.submitRequest({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: form.message,
      });
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="card text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[var(--color-secondary)] font-semibold">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-xl font-bold text-[var(--color-primary)]">{t("title")}</h3>
      <div>
        <label className="block text-sm font-medium mb-1">{t("name")}</label>
        <input
          type="text"
          required
          maxLength={200}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t("phone")}</label>
        <input
          type="tel"
          required
          maxLength={50}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t("email")}</label>
        <input
          type="email"
          maxLength={200}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t("message")}</label>
        <textarea
          required
          maxLength={2000}
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-red-600 text-sm">{t("error")}</p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-cta w-full">
        {status === "loading" ? "..." : t("submit")}
      </button>
    </form>
  );
}
