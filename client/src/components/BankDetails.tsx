"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

type Currency = "EUR" | "USD" | "TJS";

type Row = { label: string; value: string; mono?: boolean };

function CopyableRow({ label, value, mono }: Row) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available — ignore
    }
  };
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-[var(--color-text-light)] uppercase tracking-wide mb-0.5">{label}</div>
        <div className={`text-sm break-all ${mono ? "font-mono" : "font-medium"} text-[var(--color-secondary)]`}>{value}</div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy"
        className="flex-shrink-0 mt-1 p-1.5 rounded hover:bg-gray-100 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function CurrencyCard({ currency, rows, accent }: { currency: Currency; rows: Row[]; accent: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white text-sm"
          style={{ backgroundColor: accent }}
        >
          {currency}
        </span>
        <h3 className="text-lg font-bold text-[var(--color-secondary)]">{currency}</h3>
      </div>
      <div>
        {rows.map((r) => (
          <CopyableRow key={r.label} {...r} />
        ))}
      </div>
    </div>
  );
}

export default function BankDetails() {
  const t = useTranslations("donate.bank");

  const eur: Row[] = [
    { label: t("correspondentBank"), value: "JSC HALYK BANK, ALMATY, KAZAKHSTAN" },
    { label: "SWIFT", value: "HSBKKZKX", mono: true },
    { label: t("correspondentAccount"), value: "KZ396010071000000217", mono: true },
    { label: t("beneficiaryBank"), value: "CJSC ACTIV BANK, DUSHANBE, TAJIKISTAN" },
    { label: t("beneficiaryBankSwift"), value: "KZKOTJ22", mono: true },
    { label: t("beneficiaryName"), value: "PUBLIC ORGANIZATION KORVONI UMED" },
    { label: t("accountNumber"), value: "20206978781304386160", mono: true },
  ];

  const usd: Row[] = [
    { label: t("correspondentBank"), value: "JSC HALYK BANK, ALMATY, KAZAKHSTAN" },
    { label: "SWIFT", value: "HSBKKZKX", mono: true },
    { label: t("correspondentAccount"), value: "KZ236010071000000214", mono: true },
    { label: t("beneficiaryBank"), value: "CJSC ACTIV BANK, DUSHANBE, TAJIKISTAN" },
    { label: t("beneficiaryBankSwift"), value: "KZKOTJ22", mono: true },
    { label: t("beneficiaryName"), value: "PUBLIC ORGANIZATION KORVONI UMED" },
    { label: t("accountNumber"), value: "20206840751101036001", mono: true },
  ];

  const tjs: Row[] = [
    { label: t("beneficiaryName"), value: "PUBLIC ORGANIZATION KORVONI UMED" },
    { label: "БИК", value: "350101779", mono: true },
    { label: t("correspondentAccount"), value: "20402972517791", mono: true },
    { label: t("settlementAccount"), value: "20202972681304387544", mono: true },
    { label: "ИНН", value: "020028044", mono: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CurrencyCard currency="EUR" rows={eur} accent="var(--color-primary)" />
      <CurrencyCard currency="USD" rows={usd} accent="var(--color-secondary)" />
      <CurrencyCard currency="TJS" rows={tjs} accent="var(--color-accent)" />
    </div>
  );
}
