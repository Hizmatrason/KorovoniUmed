"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const LANGS = [
  { key: "Ru", label: "Русский", flag: "🇷🇺" },
  { key: "Tj", label: "Тоҷикӣ", flag: "🇹🇯" },
  { key: "En", label: "English", flag: "🇬🇧" },
] as const;

type LangKey = (typeof LANGS)[number]["key"];

export default function CreateNewsPage() {
  const router = useRouter();
  const locale = useLocale();
  const [activeLang, setActiveLang] = useState<LangKey>("Ru");
  const [form, setForm] = useState({
    titleRu: "", titleTj: "", titleEn: "",
    contentRu: "", contentTj: "", contentEn: "",
    summaryRu: "", summaryTj: "", summaryEn: "",
    imageUrl: "",
    status: 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mdImageInputRef = useRef<HTMLInputElement>(null);
  const [mdUploading, setMdUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleRu.trim() || !form.contentRu.trim()) {
      setError("Заполните заголовок и содержание на русском языке");
      setActiveLang("Ru");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await api.createNews(form);
      router.push(`/${locale}/admin/news`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка сохранения";
      try {
        const parsed = JSON.parse(msg);
        if (parsed.errors) {
          setError(Object.values(parsed.errors).flat().join(", "));
        } else {
          setError(parsed.title || msg);
        }
      } catch {
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setForm({ ...form, imageUrl: url });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const setField = (field: string, value: string) => setForm({ ...form, [field]: value });

  const insertImageIntoMd = useCallback(async (file: File) => {
    const contentKey = `content${activeLang}` as keyof typeof form;
    setMdUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      const imgMd = `![${file.name}](${url})`;
      setForm((prev) => ({ ...prev, [contentKey]: (prev[contentKey] || "") + "\n" + imgMd + "\n" }));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setMdUploading(false);
    }
  }, [activeLang]);

  const handleMdPaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await insertImageIntoMd(file);
        return;
      }
    }
  }, [insertImageIntoMd]);

  const handleMdDrop = useCallback(async (e: React.DragEvent) => {
    const files = e.dataTransfer?.files;
    if (!files) return;
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        e.preventDefault();
        await insertImageIntoMd(file);
      }
    }
  }, [insertImageIntoMd]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Создать новость</h1>
          <p className="text-sm text-gray-500 mt-0.5">Заполните контент на всех языках</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Main content area */}
          <div className="space-y-6">
            {/* Language tabs */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex border-b border-gray-200">
                {LANGS.map((lang) => (
                  <button
                    key={lang.key}
                    type="button"
                    onClick={() => setActiveLang(lang.key)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeLang === lang.key
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                    {/* Indicator if content filled */}
                    {form[`title${lang.key}` as keyof typeof form] && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    required={activeLang === "Ru"}
                    value={form[`title${activeLang}` as keyof typeof form] as string}
                    onChange={(e) => setField(`title${activeLang}`, e.target.value)}
                    placeholder={`Заголовок на ${LANGS.find((l) => l.key === activeLang)?.label}`}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Краткое описание
                  </label>
                  <input
                    type="text"
                    value={form[`summary${activeLang}` as keyof typeof form] as string}
                    onChange={(e) => setField(`summary${activeLang}`, e.target.value)}
                    placeholder="Короткое описание для карточки новости"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>

                <div data-color-mode="light" onPaste={handleMdPaste} onDrop={handleMdDrop}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Содержание <span className="text-gray-400 font-normal">(Markdown)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {mdUploading && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <span className="w-3 h-3 border-2 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin" />
                          Загрузка...
                        </span>
                      )}
                      <input
                        ref={mdImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await insertImageIntoMd(file);
                          e.target.value = "";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => mdImageInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Вставить фото
                      </button>
                    </div>
                  </div>
                  <MDEditor
                    value={form[`content${activeLang}` as keyof typeof form] as string}
                    onChange={(val) => setField(`content${activeLang}`, val || "")}
                    height={400}
                    preview="live"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Публикация</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Статус</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: parseInt(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  >
                    <option value={0}>Черновик</option>
                    <option value={1}>Опубликовано</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                  >
                    {saving ? "Сохранение..." : "Создать"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Изображение</h3>
              {form.imageUrl ? (
                <div className="space-y-3">
                  <img
                    src={form.imageUrl.startsWith("http") ? form.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5248"}${form.imageUrl}`}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Удалить изображение
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors">
                  <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-400">
                    {uploading ? "Загрузка..." : "Нажмите для загрузки"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Language completion status */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Заполненность</h3>
              <div className="space-y-2">
                {LANGS.map((lang) => {
                  const hasTitle = !!form[`title${lang.key}` as keyof typeof form];
                  const hasContent = !!form[`content${lang.key}` as keyof typeof form];
                  const complete = hasTitle && hasContent;
                  return (
                    <div key={lang.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{lang.flag} {lang.label}</span>
                      <span className={`text-xs font-medium ${complete ? "text-emerald-600" : hasTitle || hasContent ? "text-amber-600" : "text-gray-400"}`}>
                        {complete ? "✓ Готово" : hasTitle || hasContent ? "Частично" : "Пусто"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
