"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { api, type HelpRequest, type PagedResult, type ChatSession } from "@/lib/api";

const statusLabels: Record<number, string> = { 0: "Новая", 1: "В работе", 2: "Закрыта" };
const statusColors: Record<number, string> = {
  0: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  1: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  2: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState<PagedResult<HelpRequest> | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    api.getRequests(1, 5).then(setRequests).catch(console.error);
    api.getChatSessions().then(setChatSessions).catch(console.error);
  }, []);

  const newCount = requests?.items.filter((r) => r.status === 0).length ?? 0;
  const inWorkCount = requests?.items.filter((r) => r.status === 1).length ?? 0;
  const activeChats = chatSessions.filter((s) => s.isActive).length;

  const stats = [
    { label: "Всего заявок", value: requests?.totalCount ?? "—", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" },
    { label: "Новые заявки", value: newCount, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z", color: "bg-amber-50 text-amber-600" },
    { label: "В работе", value: inWorkCount, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "bg-blue-50 text-blue-600" },
    { label: "Активные чаты", value: activeChats, icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-sm text-gray-500 mt-1">Обзор активности системы</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push(`/${locale}/admin/requests`)}
          className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-[var(--color-primary)] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Заявки на помощь</p>
              <p className="text-xs text-gray-500 mt-0.5">Просмотр и управление</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        <button
          onClick={() => router.push(`/${locale}/admin/news/create`)}
          className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-[var(--color-primary)] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Создать новость</p>
              <p className="text-xs text-gray-500 mt-0.5">Новая публикация</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>
        <button
          onClick={() => router.push(`/${locale}/admin/chat`)}
          className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-[var(--color-primary)] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Открыть чат</p>
              <p className="text-xs text-gray-500 mt-0.5">Ответить посетителям</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Recent requests table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Последние заявки</h2>
          <button
            onClick={() => router.push(`/${locale}/admin/requests`)}
            className="text-xs text-[var(--color-primary)] hover:underline font-medium"
          >
            Все заявки →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              </tr>
            </thead>
            <tbody>
              {requests?.items.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => router.push(`/${locale}/admin/requests/${r.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-5 font-medium text-gray-900">{r.name}</td>
                  <td className="py-3 px-5 text-gray-600">{r.phone}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[r.status] || ""}`}>
                      {statusLabels[r.status]}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
              {!requests && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-400 text-sm">Загрузка...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
