import { formatDate, formatPct, formatVnd } from "@/lib/portfolio/format";
import type { Holding, Txn } from "@/lib/portfolio/types";
import { cn } from "@/lib/cn";
import { BookOpen, Brain, ShieldCheck, Target } from "lucide-react";
import type { ReactNode } from "react";

export function JournalPanel({ txns, holdings, initialCapital }: { txns: Txn[]; holdings: Holding[]; initialCapital: number }) {
  const byId = new Map(holdings.map((holding) => [holding.id, holding]));
  const cryptoForex = holdings.filter((holding) => holding.class === "crypto" || holding.class === "forex");
  const journaled = txns.filter((txn) => txn.setup || txn.thesis || txn.emotion || txn.stopLoss || txn.takeProfit);
  const buys = txns.filter((txn) => txn.side === "buy").length;
  const sells = txns.filter((txn) => txn.side === "sell").length;
  const riskTagged = txns.filter((txn) => typeof txn.riskPct === "number");
  const avgRisk = riskTagged.length ? riskTagged.reduce((sum, txn) => sum + (txn.riskPct ?? 0), 0) / riskTagged.length : 0;

  return (
    <div className="grid gap-4">
      <section className="rounded-card bg-pine p-4 text-foam shadow-lift sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-foam-dim uppercase">Nhật ký giao dịch</p>
            <h2 className="mt-1 font-display text-3xl">Giao dịch có chủ đích</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foam-dim">Mỗi lệnh nên để lại một lý do: setup, khung thời gian, mức rủi ro và cảm xúc lúc vào lệnh.</p>
          </div>
          <BookOpen className="mt-1 size-7 shrink-0 text-brass-bright" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-foam/15 pt-4 sm:grid-cols-4">
          <JournalStat label="Tổng lệnh" value={String(txns.length)} />
          <JournalStat label="Mua / bán" value={`${buys} / ${sells}`} />
          <JournalStat label="Đã ghi chú" value={`${journaled.length}/${txns.length}`} />
          <JournalStat label="Rủi ro TB" value={riskTagged.length ? formatPct(avgRisk) : "—"} />
        </div>
      </section>

      <section className="rounded-card bg-card p-4 shadow-card sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brass uppercase">Vùng tập trung</p>
            <h2 className="mt-1 font-display text-2xl text-ink">Crypto & Forex</h2>
          </div>
          <span className="text-xs text-muted">{cryptoForex.length} vị thế</span>
        </div>
        {cryptoForex.length ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {cryptoForex.map((holding) => (
              <div key={holding.id} className="rounded-control bg-paper px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">{holding.symbol}</span>
                  <span className="text-xs font-semibold text-brass">{holding.class === "crypto" ? "Crypto" : "Forex"}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{holding.name} · {formatVnd(holding.quantity * holding.price, { compact: true })}</p>
              </div>
            ))}
          </div>
        ) : <p className="mt-4 text-sm text-muted">Thêm BTC, ETH, EURUSD hoặc XAUUSD để bắt đầu theo dõi.</p>}
      </section>

      <section className="rounded-card bg-card p-4 shadow-card sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brass uppercase">Dòng lệnh</p>
            <h2 className="mt-1 font-display text-2xl text-ink">Lịch sử gần đây</h2>
          </div>
          <span className="text-xs text-muted">Vốn đầu kỳ {formatVnd(initialCapital, { compact: true })}</span>
        </div>
        {txns.length ? (
          <div className="mt-4 divide-y divide-line">
            {txns.slice(0, 12).map((txn) => {
              const holding = byId.get(txn.holdingId);
              return <article key={txn.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("text-xs font-bold uppercase", txn.side === "buy" ? "text-up" : "text-down")}>{txn.side === "buy" ? "Mua" : "Bán"}</span>
                      <span className="font-semibold text-ink">{holding?.symbol ?? "—"}</span>
                      <span className="text-xs text-muted">{formatDate(txn.date)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{txn.setup ? `${txn.setup} · ` : ""}{txn.timeframe || "Chưa có khung"}{txn.emotion ? ` · ${txn.emotion}` : ""}</p>
                    {txn.thesis ? <p className="mt-1 text-sm leading-relaxed text-ink-soft">“{txn.thesis}”</p> : <p className="mt-1 text-xs text-muted">Chưa ghi lý do vào lệnh</p>}
                  </div>
                  <div className="shrink-0 text-right tabular-nums">
                    <p className="font-semibold text-ink">{txn.quantity} · {formatVnd(txn.price, { compact: true })}</p>
                    {txn.riskPct || txn.stopLoss || txn.takeProfit ? <p className="mt-1 text-xs text-muted">Rủi ro {txn.riskPct ?? "—"}% · SL {txn.stopLoss ?? "—"}</p> : null}
                  </div>
                </div>
              </article>;
            })}
          </div>
        ) : <p className="mt-4 text-sm text-muted">Chưa có giao dịch nào.</p>}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Tip icon={<Target className="size-4" />} title="Kế hoạch" body="Ghi setup và thesis trước khi bấm Ghi sổ." />
        <Tip icon={<ShieldCheck className="size-4" />} title="Rủi ro" body="Giữ rủi ro mỗi lệnh nhỏ và nhất quán." />
        <Tip icon={<Brain className="size-4" />} title="Tâm lý" body="Đánh dấu cảm xúc để tìm lỗi lặp lại." />
      </section>
    </div>
  );
}

function JournalStat({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-foam-dim">{label}</p><p className="mt-1 font-semibold tabular-nums">{value}</p></div>;
}

function Tip({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <article className="rounded-card bg-card p-4 shadow-card"><div className="flex items-center gap-2 text-brass">{icon}<span className="font-semibold text-ink">{title}</span></div><p className="mt-2 text-sm leading-relaxed text-muted">{body}</p></article>;
}
