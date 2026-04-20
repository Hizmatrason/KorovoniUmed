"use client";

import { useEffect, useState } from "react";
import { api, type UserInfo } from "@/lib/api";

const roleLabels: Record<string, string> = {
  Admin: "Администратор",
  Operator: "Оператор",
  ContentManager: "Контент-менеджер",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "Operator" });
  const [error, setError] = useState("");

  const load = () => api.getUsers().then(setUsers).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.createUser(form);
      setForm({ email: "", password: "", fullName: "", role: "Operator" });
      setShowCreate(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка при создании пользователя");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этого пользователя?")) return;
    await api.deleteUser(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Пользователи</h1>
          <p className="text-sm text-gray-500 mt-1">Управление доступом к системе</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Новый пользователь</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">ФИО</label>
              <input
                type="text" required value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Пароль</label>
              <input
                type="password" required minLength={6} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Роль</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              >
                <option value="Admin">Администратор</option>
                <option value="Operator">Оператор</option>
                <option value="ContentManager">Контент-менеджер</option>
              </select>
            </div>
            {error && <p className="text-red-600 text-sm md:col-span-2">{error}</p>}
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
                Создать
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users list */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Создан</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const initials = u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <span className="font-medium text-gray-900">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-gray-600">{u.email}</td>
                    <td className="py-3 px-5">
                      {u.roles.map((r) => (
                        <span key={r} className="inline-flex px-2 py-0.5 bg-gray-50 rounded-md text-xs font-medium text-gray-600 ring-1 ring-gray-200 mr-1">
                          {roleLabels[r] || r}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 px-5 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
