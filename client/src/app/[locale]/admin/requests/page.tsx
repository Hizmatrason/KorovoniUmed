"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { api, type HelpRequest, type PagedResult } from "@/lib/api";

const statusLabels: Record<number, string> = { 0: "Новая", 1: "В работе", 2: "Закрыта" };
const statusColors: Record<number, string> = {
  0: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  1: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  2: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export default function AdminRequestsPage() {
  const [data, setData] = useState<PagedResult<HelpRequest> | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<number | undefined>(undefined);
  const router = useRouter();
  const locale = useLocale();

  const load = () => api.getRequests(page, 20, filter).then(setData).catch(console.error);

  useEffect(() => { load(); }, [page, filter]);

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

  const filters = [
    { value: undefined, label: "Все", count: data?.totalCount },
    { value: 0, label: "Новые" },
    { value: 1, label: "В работе" },
    { value: 2, label: "Закрытые" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Заявки на помощь</h1>
        <p className="text-sm text-gray-500 mt-1">Управление обращениями</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === f.value
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {f.label}
            {f.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filter === f.value ? "bg-white/20" : "bg-gray-100"
              }`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Сообщение</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => router.push(`/${locale}/admin/requests/${r.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-5 text-gray-500 font-mono text-xs">#{r.id}</td>
                  <td className="py-3 px-5 font-medium text-gray-900">{r.name}</td>
                  <td className="py-3 px-5 text-gray-600">{r.phone}</td>
                  <td className="py-3 px-5 text-gray-500 max-w-xs truncate hidden lg:table-cell">{r.message}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[r.status]}`}>
                      {statusLabels[r.status]}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-500 text-xs">
                    {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Заявки не найдены</td></tr>
              )}
              {!data && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Загрузка...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Страница {page} из {totalPages} • Всего {data!.totalCount}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ←
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                      page === pageNum
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
