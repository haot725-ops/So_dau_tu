import { AllocationDonut, PortfolioChart, SLICE_COLORS } from "@/components/aurea/charts";
import { Button } from "@/components/aurea/ui";
import { classLabel, formatMoney, formatNum, formatPct, formatQty, formatVnd, pnlTone, todayISO } from "@/lib/portfolio/format";
import { buildInsights, healthOf, historyOf, rebalancePlans, shockedValue, totalValue, type Row, type ShockId } from "@/lib/portfolio/math";
import { usePortfolio } from "@/lib/portfolio/store";
import type { Holding } from "@/lib/portfolio/types";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { toast } from "sonner";

const toneText = { up: "text-up", down: "text-down", flat: "text-muted" } as const;

function useCurrency() {
  return {
    displayCurrency: usePortfolio((state) => state.displayCurrency),
    usdVndRate: usePortfolio((state) => state.usdVndRate),
  };
}

export function OverviewPanel({ rows, holdings }: { rows: Row[]; holdings: Holding[] }) {
  const { displayCurrency, usdVndRate } = useCurrency();
  const points = historyOf(holdings);
  const movers = [...rows].filter((row) => row.h.class !== "cash").sort((a, b) => b.day - a.day);
  const best = movers[0];
  const worst = movers[movers.length - 1];
  const realized = holdings.reduce((sum, holding) => sum + holding.realized, 0);
  const unrealized = rows.reduce((sum, row) => sum + row.pnl, 0);
  return (
    <div className="grid gap-4">
      <section className="rounded-card bg-card p-4 shadow-card sm:p-5">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl text-ink">14 phiên gần nhất</h2>
          <p className="text-xs text-muted">Giữ nguyên số lượng hiện tại</p>
        </div>
        <PortfolioChart points={points} />
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <Mover title="Kéo danh mục lên" row={best} />
        <Mover title="Kéo danh mục xuống" row={worst} />
      </div>
      <section className="grid gap-3 rounded-card bg-card p-4 shadow-card sm:grid-cols-3 sm:p-5">
        <Mini label="Lãi chưa chốt" value={formatMoney(unrealized, displayCurrency, usdVndRate, { signed: true, compact: true })} tone={pnlTone(unrealized)} />
        <Mini label="Lãi đã chốt" value={formatMoney(realized, displayCurrency, usdVndRate, { signed: true, compact: true })} tone={pnlTone(realized)} />
        <Mini label="Số vị thế" value={String(rows.filter((row) => row.h.class !== "cash" && row.h.quantity > 0).length)} tone="flat" />
      </section>
    </div>
  );
}

function Mover({ title, row }: { title: string; row: Row | undefined }) {
  if (!row) return null;
  return (
    <article className="rounded-card bg-card p-4 shadow-card">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
      <h3 className="mt-2 font-display text-2xl text-ink">{row.h.symbol}</h3>
      <p className="text-sm text-ink-soft">{row.h.name}</p>
      <p className={cn("mt-3 font-semibold tabular-nums", toneText[pnlTone(row.day)])}>
        {formatVnd(row.day, { signed: true, compact: true })}
        <span className="ml-2 text-sm">{formatPct((row.h.spark.at(-2) ? (row.h.price - row.h.spark.at(-2)!) / row.h.spark.at(-2)! : 0) * 100)}</span>
      </p>
    </article>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: "up" | "down" | "flat" }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={cn("mt-1 font-display text-2xl tabular-nums", tone === "flat" ? "text-ink" : toneText[tone])}>{value}</p>
    </div>
  );
}

export function AllocationPanel({ rows }: { rows: Row[] }) {
  const { displayCurrency, usdVndRate } = useCurrency();
  const total = totalValue(rows);
  const byClass = new Map<string, { name: string; value: number }>();
  for (const row of rows) {
    const name = classLabel(row.h.class);
    const current = byClass.get(name) ?? { name, value: 0 };
    current.value += row.value;
    byClass.set(name, current);
  }
  const slices = [...byClass.values()].filter((slice) => slice.value > 0).sort((a, b) => b.value - a.value);
  const sectors = new Map<string, number>();
  for (const row of rows) sectors.set(row.h.sector, (sectors.get(row.h.sector) ?? 0) + row.value);
  const sectorRows = [...sectors.entries()].sort((a, b) => b[1] - a[1]);
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-card bg-card p-4 shadow-card sm:p-5">
        <h2 className="font-display text-2xl text-ink">Theo loại tài sản</h2>
        <div className="relative">
          <AllocationDonut slices={slices} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted">Tổng</span>
            <span className="font-display text-2xl tabular-nums text-ink">{formatMoney(total, displayCurrency, usdVndRate, { compact: true })}</span>
          </div>
        </div>
        <ul className="grid gap-2">
          {slices.map((slice, index) => (
            <li key={slice.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: SLICE_COLORS[index % SLICE_COLORS.length] }} />
                {slice.name}
              </span>
              <span className="tabular-nums text-ink-soft">
                {formatNum(total ? (slice.value / total) * 100 : 0)}% · {formatMoney(slice.value, displayCurrency, usdVndRate, { compact: true })}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-card bg-card p-4 shadow-card sm:p-5">
        <h2 className="font-display text-2xl text-ink">Theo nhóm</h2>
        <ul className="mt-4 grid gap-4">
          {sectorRows.map(([sector, value]) => {
            const pct = total ? (value / total) * 100 : 0;
            return (
              <li key={sector}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-ink">{sector}</span>
                  <span className="tabular-nums text-muted">
                    {formatNum(pct)}% · {formatMoney(value, displayCurrency, usdVndRate, { compact: true })}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-paper-2">
                  <div className="h-full rounded-full bg-pine" style={{ width: `${Math.max(2, Math.min(100, pct))}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

const SHOCKS: { id: ShockId; label: string; detail: string }[] = [
  { id: "equities", label: "Cổ phiếu & quỹ −10%", detail: "Vàng, crypto và tiền mặt đứng yên." },
  { id: "gold", label: "Vàng −5%", detail: "Chỉ miếng vàng và tài sản loại vàng." },
  { id: "crypto", label: "Crypto −25%", detail: "Nhịp giảm mạnh của tài sản số." },
  { id: "banks", label: "Ngân hàng −8%", detail: "Các mã thuộc nhóm Ngân hàng." },
];

export function InsightsPanel({ rows, onOpen }: { rows: Row[]; onOpen: (id: string) => void }) {
  const { displayCurrency, usdVndRate } = useCurrency();
  const holdings = usePortfolio((state) => state.holdings);
  const rebalance = usePortfolio((state) => state.rebalance);
  const health = healthOf(rows);
  const insights = buildInsights(rows);
  const plans = rebalancePlans(holdings, usdVndRate);
  const total = totalValue(rows);
  const [shock, setShock] = useState<ShockId | null>(null);
  const shocked = shock ? shockedValue(rows, shock) : total;
  const sells = plans.filter((plan) => plan.side === "sell").reduce((sum, plan) => sum + plan.value, 0);
  const buys = plans.filter((plan) => plan.side === "buy").reduce((sum, plan) => sum + plan.value, 0);

  return (
    <div className="grid gap-4">
      <section className="rounded-card bg-card p-4 shadow-card sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brass uppercase">Sức khỏe danh mục</p>
            <h2 className="mt-1 font-display text-3xl text-ink">
              {health.score} · {health.label}
            </h2>
          </div>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {health.factors.map((factor) => (
            <li key={factor.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="font-semibold text-ink">{factor.label}</span>
                <span className="tabular-nums text-muted">{factor.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-paper-2">
                <div className="h-full rounded-full bg-pine" style={{ width: `${factor.score}%` }} />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{factor.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-3">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-card bg-card p-4 shadow-card sm:p-5">
            <p className={cn("text-xs font-semibold tracking-wide uppercase", insight.tone === "warn" ? "text-brass" : insight.tone === "good" ? "text-up" : "text-muted")}>
              {insight.tone === "warn" ? "Cần để mắt" : insight.tone === "good" ? "Đang ổn" : "Quan sát"}
            </p>
            <h3 className="mt-1 font-display text-2xl text-ink">{insight.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{insight.body}</p>
            {insight.holdingId ? (
              <button type="button" className="mt-3 inline-flex h-11 items-center text-sm font-semibold text-pine" onClick={() => onOpen(insight.holdingId!)}>
                Mở thẻ
              </button>
            ) : null}
          </article>
        ))}
      </div>

      <section className="rounded-card bg-card p-4 shadow-card sm:p-5">
        <h2 className="font-display text-2xl text-ink">Phiếu tái cân bằng</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Đưa từng vị thế về mục tiêu bạn đã kéo trên thẻ. Bán trước, mua sau, tiền mặt là ví khớp.
        </p>
        {plans.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Không có lệnh nào đáng kể. Danh mục đang sát mục tiêu.</p>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-line">
              {plans.map((plan) => (
                <li key={`${plan.side}-${plan.holdingId}`} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <span className={cn("font-semibold", plan.side === "buy" ? "text-up" : "text-down")}>{plan.side === "buy" ? "Mua" : "Bán"}</span>
                    <span className="text-ink"> {plan.symbol}</span>
                    <div className="text-xs text-muted">{formatQty({ class: plan.class, quantity: plan.quantity })}</div>
                  </div>
                  <span className="tabular-nums text-ink-soft">{formatMoney(plan.value, displayCurrency, usdVndRate, { compact: true })}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Bán thu {formatMoney(sells, displayCurrency, usdVndRate, { compact: true })} · Mua cần {formatMoney(buys, displayCurrency, usdVndRate, { compact: true })}. Lệnh mua thiếu tiền sẽ bị bỏ qua.
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                const result = rebalance(todayISO());
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success(
                  result.skipped > 0
                    ? `Đã ghi ${result.done} lệnh, bỏ ${result.skipped} vì thiếu tiền.`
                    : `Đã ghi ${result.done} lệnh vào sổ.`,
                );
              }}
            >
              Mô phỏng vào sổ
            </Button>
          </>
        )}
      </section>

      <section className="rounded-card bg-pine p-4 text-foam shadow-lift sm:p-5">
        <h2 className="font-display text-2xl">Thử sức chịu đựng</h2>
        <p className="mt-1 text-sm text-foam-dim">Không đổi sổ. Chỉ xem danh mục còn bao nhiêu nếu một cú sốc xảy ra hôm nay.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {SHOCKS.map((item) => {
            const active = shock === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setShock(active ? null : item.id)}
                className={cn(
                  "h-auto min-h-11 rounded-control px-3 py-2 text-left text-sm transition-colors active:scale-[0.96]",
                  active ? "bg-foam text-ink" : "bg-pine-2 text-foam",
                )}
              >
                <span className="block font-semibold">{item.label}</span>
                <span className={cn("mt-0.5 block text-xs", active ? "text-muted" : "text-foam-dim")}>{item.detail}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 font-display text-3xl tabular-nums">
          {formatMoney(shocked, displayCurrency, usdVndRate, { compact: true })}
          {shock ? (
            <span className={cn("ml-3 text-lg", shocked - total < 0 ? "text-rose" : "text-mint")}>
              {formatMoney(shocked - total, displayCurrency, usdVndRate, { signed: true, compact: true })}
            </span>
          ) : null}
        </p>
      </section>
    </div>
  );
}
