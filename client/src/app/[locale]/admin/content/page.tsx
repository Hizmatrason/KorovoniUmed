"use client";

import { useEffect, useState } from "react";
import { api, type SiteContent } from "@/lib/api";

const langTabs = [
  { key: "Ru", label: "Русский", flag: "🇷🇺" },
  { key: "Tj", label: "Тоҷикӣ", flag: "🇹🇯" },
  { key: "En", label: "English", flag: "🇬🇧" },
] as const;

export default function AdminContentPage() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [editing, setEditing] = useState<SiteContent | null>(null);
  const [form, setForm] = useState({ valueRu: "", valueTj: "", valueEn: "" });
  const [editLang, setEditLang] = useState<"Ru" | "Tj" | "En">("Ru");
  const [saving, setSaving] = useState(false);

  const load = () => api.getAdminContent().then(setItems).catch(console.error);
  useEffect(() => { load(); }, []);

  const startEdit = (item: SiteContent) => {
    setEditing(item);
    setForm({ valueRu: item.valueRu, valueTj: item.valueTj, valueEn: item.valueEn });
    setEditLang("Ru");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await api.updateContent(editing.id, form);
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Контент сайта</h1>
        <p className="text-sm text-gray-500 mt-1">Редактирование текстов на всех языках</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex px-2 py-0.5 bg-gray-100 rounded-md text-xs font-mono text-gray-600">
                    {item.key}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-xs shrink-0">🇷🇺</span>
                    <span className="truncate">{item.valueRu || <span className="text-gray-400 italic">Пусто</span>}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="text-xs shrink-0">🇹🇯</span>
                    <span className="truncate">{item.valueTj || <span className="text-gray-400 italic">Пусто</span>}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="text-xs shrink-0">🇬🇧</span>
                    <span className="truncate">{item.valueEn || <span className="text-gray-400 italic">Пусто</span>}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => startEdit(item)}
                className="p-2 rounded-lg text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Редактирование</h2>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">{editing.key}</p>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Language tabs */}
            <div className="flex border-b border-gray-100">
              {langTabs.map((lang) => (
                <button
                  key={lang.key}
                  type="button"
                  onClick={() => setEditLang(lang.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    editLang === lang.key
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="text-xs">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              <textarea
                rows={5}
                value={form[`value${editLang}` as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [`value${editLang}`]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none"
                placeholder={`Текст на ${langTabs.find((l) => l.key === editLang)?.label}`}
              />
            </div>

            <div className="flex justify-end gap-2 p-5 pt-0">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
