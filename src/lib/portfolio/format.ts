import type { AssetClass, DisplayCurrency, Holding } from "@/lib/portfolio/types";

export const DEFAULT_USD_VND_RATE = 25_500;

export function formatVnd(value: number, opts?: { signed?: boolean; compact?: boolean }): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : opts?.signed && value > 0 ? "+" : "";
  if (opts?.compact) {
    if (abs >= 1_000_000_000) {
      return `${sign}${(abs / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 2, minimumFractionDigits: 0 })} tỷ`;
    }
    if (abs >= 1_000_000) {
      return `${sign}${(abs / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1, minimumFractionDigits: 0 })} tr`;
    }
  }
  return `${sign}${Math.round(abs).toLocaleString("vi-VN")} ₫`;
}

export function formatNum(value: number, digits = 1): string {
  return value.toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function formatPct(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatNum(Math.abs(value), digits)}%`;
}

export function formatQty(holding: Pick<Holding, "class" | "quantity">): string {
  const digits = holding.class === "crypto" ? 4 : holding.class === "forex" ? 2 : holding.class === "gold" ? 2 : 0;
  const num = holding.quantity.toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
  if (holding.class === "gold") return `${num} lượng`;
  if (holding.class === "crypto") return `${num} coin`;
  if (holding.class === "forex") return `${num} lot`;
  if (holding.class === "cash") return formatVnd(holding.quantity);
  return `${num} cp`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function classLabel(asset: AssetClass): string {
  switch (asset) {
    case "stock":
      return "Cổ phiếu";
    case "fund":
      return "Quỹ";
    case "gold":
      return "Vàng";
    case "crypto":
      return "Crypto";
    case "forex":
      return "Forex";
    case "bond":
      return "Trái phiếu";
    case "cash":
      return "Tiền mặt";
  }
}

export function pnlTone(value: number): "up" | "down" | "flat" {
  if (value > 0.0000001) return "up";
  if (value < -0.0000001) return "down";
  return "flat";
}

export function formatMoney(valueVnd: number, currency: DisplayCurrency, rate = DEFAULT_USD_VND_RATE, opts?: { signed?: boolean; compact?: boolean }): string {
  if (currency === "VND") return formatVnd(valueVnd, opts);
  const valueUsd = valueVnd / rate;
  const abs = Math.abs(valueUsd);
  const sign = valueUsd < 0 ? "−" : opts?.signed && valueUsd > 0 ? "+" : "";
  if (opts?.compact && abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M $`;
  if (opts?.compact && abs >= 1_000) return `${sign}${(abs / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K $`;
  return `${sign}${abs.toLocaleString("en-US", { maximumFractionDigits: 2 })} $`;
}

export function formatQuotePrice(holding: Pick<Holding, "class" | "quoteCurrency">, price: number, currency: DisplayCurrency, rate = DEFAULT_USD_VND_RATE): string {
  const source = holding.quoteCurrency === "USD" || holding.class === "crypto" ? "USD" : "VND";
  const value = source === "USD" && currency === "VND" ? price * rate : source === "VND" && currency === "USD" ? price / rate : price;
  return source === "USD" || currency === "USD" ? `${value.toLocaleString("en-US", { maximumFractionDigits: value < 10 ? 4 : 2 })} $` : `${Math.round(value).toLocaleString("vi-VN")} ₫`;
}

/** Phiên giao dịch lùi từ 30.10.2026, bỏ thứ 7 và chủ nhật. Cố định để SSR khớp client. */
export function sessionLabels(count: number): string[] {
  const labels: string[] = [];
  const cursor = new Date(Date.UTC(2026, 9, 30));
  while (labels.length < count) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      const dd = String(cursor.getUTCDate()).padStart(2, "0");
      const mm = String(cursor.getUTCMonth() + 1).padStart(2, "0");
      labels.push(`${dd}/${mm}`);
    }
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return labels.reverse();
}

export function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}
