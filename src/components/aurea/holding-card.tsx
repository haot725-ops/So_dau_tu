import { Sparkline } from "@/components/aurea/sparkline";
import { WeightBar } from "@/components/aurea/ui";
import { classLabel, formatMoney, formatNum, formatPct, formatQty, formatQuotePrice, pnlTone } from "@/lib/portfolio/format";
import { usePortfolio } from "@/lib/portfolio/store";
import type { Row } from "@/lib/portfolio/math";
import { cn } from "@/lib/cn";

const toneClass = {
  up: "text-up",
  down: "text-down",
  flat: "text-muted",
} as const;

export function HoldingCard({ row, onOpen, delay }: { row: Row; onOpen: (id: string) => void; delay: number }) {
  const { h } = row;
  const tone = pnlTone(row.pnl);
  const drift = row.drift;
  const displayCurrency = usePortfolio((state) => state.displayCurrency);
  const usdVndRate = usePortfolio((state) => state.usdVndRate);
  return (
    <button
      type="button"
      onClick={() => onOpen(h.id)}
      style={{ animationDelay: `${delay}ms` }}
      className="card-sheen rise flex w-full flex-col rounded-card bg-card p-4 text-left shadow-card transition-[translate,scale] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.96]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-2xl leading-none tracking-tight text-ink">{h.symbol}</div>
          <p className="mt-1 truncate text-sm text-ink-soft">{h.name}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-soft">{classLabel(h.class)}</span>
          {h.class === "crypto" || h.class === "forex" ? <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", h.direction === "short" ? "bg-rose/15 text-rose" : "bg-moss/15 text-moss")}>{h.direction === "short" ? "Short" : "Long"} · {h.market === "futures" ? "Futures" : "Spot"}</span> : null}
        </div>
      </div>
      <div className="mt-4 h-12">
        {h.class === "cash" ? (
          <svg viewBox="0 0 160 48" className="h-full w-full text-moss" aria-hidden>
            <line x1="0" y1="24" x2="160" y2="24" stroke="currentColor" strokeWidth="1.75" strokeDasharray="5 6" />
          </svg>
        ) : (
          <Sparkline data={h.spark} />
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-xl tabular-nums text-ink">{formatMoney(row.value, displayCurrency, usdVndRate, { compact: true })}</div>
          <div className="mt-0.5 truncate text-xs text-muted">
            {h.class === "cash" ? "Sẵn sàng khớp lệnh" : `${formatQty(h)} · ${formatQuotePrice(h, h.price, displayCurrency, usdVndRate)}`}
          </div>
        </div>
        <div className={cn("text-right text-sm font-semibold tabular-nums", toneClass[tone])}>
          <div>{h.class === "cash" ? "0%" : formatPct(row.pnlPct)}</div>
          <div className="text-xs font-medium">{h.class === "cash" ? "—" : formatMoney(row.pnl, displayCurrency, usdVndRate, { signed: true, compact: true })}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-muted">
          <span className="truncate">{h.sector}</span>
          <span className="shrink-0 tabular-nums">
            {formatNum(row.weight)}%
            {Math.abs(drift) >= 1.5 ? (
              <span className={cn("ml-1 font-semibold", drift > 0 ? "text-brass" : "text-pine")}>
                {drift > 0 ? "dư" : "thiếu"} {formatNum(Math.abs(drift))}
              </span>
            ) : (
              <span className="ml-1">· sát mục tiêu</span>
            )}
          </span>
        </div>
        <WeightBar actual={row.weight} target={row.target} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
        <RiskMetric label="Tỷ trọng" value={`${formatNum(row.weight)}%`} detail={`mục tiêu ${formatNum(row.target)}%`} tone={Math.abs(drift) >= 3 ? "warn" : "good"} progress={Math.min(100, row.weight * 2)} />
        <RiskMetric label="Đòn bẩy" value={h.class === "cash" ? "—" : `${h.leverage ?? 1}x`} detail={h.leverage && h.leverage > 1 ? "đang dùng" : "spot / 1x"} tone={h.leverage && h.leverage > 5 ? "warn" : "good"} progress={h.class === "cash" ? 0 : Math.min(100, ((h.leverage ?? 1) / 10) * 100)} />
        <RiskMetric label="Rủi ro" value={h.class === "cash" ? "—" : h.riskPct ? `${formatNum(h.riskPct)}%` : "Chưa đặt"} detail={h.riskPct ? "khi chạm SL" : "cài trong hồ sơ"} tone={h.riskPct && h.riskPct > 2 ? "warn" : h.riskPct ? "good" : "flat"} progress={h.riskPct ? Math.min(100, h.riskPct * 25) : 0} />
      </div>
    </button>
  );
}

function RiskMetric({ label, value, detail, tone, progress }: { label: string; value: string; detail: string; tone: "good" | "warn" | "flat"; progress: number }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-[10px] font-semibold tracking-wide text-muted uppercase">{label}</div>
      <div className={cn("mt-1 truncate text-sm font-bold tabular-nums", tone === "warn" ? "text-brass" : tone === "good" ? "text-ink" : "text-muted")}>{value}</div>
      <div className="mt-0.5 truncate text-[10px] text-muted">{detail}</div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-paper-2"><div className={cn("h-full rounded-full", tone === "warn" ? "bg-brass" : tone === "good" ? "bg-moss" : "bg-line")} style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
