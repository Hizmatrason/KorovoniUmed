"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { api, type NewsDetail, type PagedResult } from "@/lib/api";

export default function AdminNewsPage() {
  const [data, setData] = useState<PagedResult<NewsDetail> | null>(null);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    api.getAdminNews(page).then(setData).catch(console.error);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить эту новость?")) return;
    await api.deleteNews(id);
    api.getAdminNews(page).then(setData);
  };

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Новости</h1>
          <p className="text-sm text-gray-500 mt-1">Управление публикациями</p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/admin/news/create`)}
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать новость
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Заголовок</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((n) => (
                <tr key={n.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-5 text-gray-500 font-mono text-xs">{n.id}</td>
                  <td className="py-3 px-5">
                    <p className="font-medium text-gray-900">{n.titleRu}</p>
                    {n.summaryRu && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{n.summaryRu}</p>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                      n.status === 1
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-gray-50 text-gray-600 ring-1 ring-gray-200"
                    }`}>
                      {n.status === 1 ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-500 text-xs">
                    {new Date(n.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/${locale}/admin/news/${n.id}`)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
                        title="Редактировать"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">Нет новостей</td></tr>
              )}
              {!data && (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">Загрузка...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Показано {data!.items.length} из {data!.totalCount}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Назад
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                    page === i + 1
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Вперёд →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
