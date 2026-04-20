"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { api, type HelpRequest } from "@/lib/api";

const statusLabels: Record<number, string> = { 0: "Новая", 1: "В работе", 2: "Закрыта" };
const statusColors: Record<number, string> = {
  0: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  1: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  2: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export default function RequestDetailPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = parseInt(params.id as string);
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRequest(id).then((r) => {
      setRequest(r);
      setNotes(r.adminNotes || "");
      setLoading(false);
    }).catch(() => {
      router.push(`/${locale}/admin/requests`);
    });
  }, [id, router, locale]);

  const updateStatus = async (status: number) => {
    setSaving(true);
    try {
      await api.updateRequestStatus(id, status, notes);
      const updated = await api.getRequest(id);
      setRequest(updated);
      setNotes(updated.adminNotes || "");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    if (!request) return;
    setSaving(true);
    try {
      await api.updateRequestStatus(id, request.status, notes);
      const updated = await api.getRequest(id);
      setRequest(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/${locale}/admin/requests`)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Заявка #{request.id}</h1>
            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[request.status]}`}>
              {statusLabels[request.status]}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Создана {new Date(request.createdAt).toLocaleString("ru-RU")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Main info */}
        <div className="space-y-4">
          {/* Contact card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Контактная информация</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Имя</p>
                <p className="text-sm font-medium text-gray-900">{request.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Телефон</p>
                <a href={`tel:${request.phone}`} className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                  {request.phone}
                </a>
              </div>
              {request.email && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${request.email}`} className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                    {request.email}
                  </a>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Дата обращения</p>
                <p className="text-sm text-gray-900">
                  {new Date(request.createdAt).toLocaleString("ru-RU", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Сообщение</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{request.message}</p>
            </div>
          </div>

          {/* Admin notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Заметки</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Добавьте внутренние заметки..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={saveNotes}
                disabled={saving}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить заметки"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-4">
          {/* Status change */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Изменить статус</h3>
            <div className="space-y-2">
              {request.status !== 1 && (
                <button
                  onClick={() => updateStatus(1)}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Взять в работу
                </button>
              )}
              {request.status !== 2 && (
                <button
                  onClick={() => updateStatus(2)}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Закрыть заявку
                </button>
              )}
              {request.status === 2 && (
                <button
                  onClick={() => updateStatus(0)}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Переоткрыть
                </button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">История</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Заявка создана</p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>
              </div>
              {request.updatedAt && request.updatedAt !== request.createdAt && (
                <div className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    request.status === 2 ? "bg-emerald-400" : "bg-blue-400"
                  }`} />
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {request.status === 1 ? "Взята в работу" : request.status === 2 ? "Закрыта" : "Обновлена"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.updatedAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
