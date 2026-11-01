import { CreateDialog } from "@/components/aurea/create-dialog";
import { HoldingCard } from "@/components/aurea/holding-card";
import { HoldingSheet } from "@/components/aurea/holding-sheet";
import { JournalPanel } from "@/components/aurea/journal-panel";
import { AllocationPanel, InsightsPanel, OverviewPanel } from "@/components/aurea/panels";
import { Button, HealthRing, useCountUp } from "@/components/aurea/ui";
import { classLabel, fold, formatPct, formatVnd, pnlTone } from "@/lib/portfolio/format";
import { healthOf, rowsOf, totalValue, type Row } from "@/lib/portfolio/math";
import { usePortfolio } from "@/lib/portfolio/store";
import { ASSET_CLASSES, type AssetClass } from "@/lib/portfolio/types";
import { cn } from "@/lib/cn";
import { Plus, Search, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";

type Tab = "cards" | "journal" | "overview" | "mix" | "insights";
type SortKey = "value" | "gain" | "loss" | "drift" | "name";

const TABS: { id: Tab; label: string }[] = [
  { id: "cards", label: "Thẻ" },
  { id: "journal", label: "Nhật ký" },
  { id: "overview", label: "Toàn cảnh" },
  { id: "mix", label: "Phân bổ" },
  { id: "insights", label: "Gợi ý" },
];

const toneText = { up: "text-mint", down: "text-rose", flat: "text-foam-dim" } as const;

export function AureaApp() {
  const holdings = usePortfolio((state) => state.holdings);
  const txns = usePortfolio((state) => state.txns);
  const touched = usePortfolio((state) => state.touched);
  const initialCapital = usePortfolio((state) => state.initialCapital);
  const setInitialCapital = usePortfolio((state) => state.setInitialCapital);
  const reset = usePortfolio((state) => state.reset);
  const [tab, setTab] = useState<Tab>("cards");
  const [query, setQuery] = useState("");
  const [asset, setAsset] = useState<AssetClass | "all">("all");
  const [sort, setSort] = useState<SortKey>("value");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [armReset, setArmReset] = useState(false);
  const [capitalDraft, setCapitalDraft] = useState(String(initialCapital));

  useEffect(() => {
    void usePortfolio.persist.rehydrate();
  }, []);

  useEffect(() => {
    setCapitalDraft(String(initialCapital));
  }, [initialCapital]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        document.getElementById("aurea-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows = useMemo(() => rowsOf(holdings), [holdings]);
  const health = useMemo(() => healthOf(rows), [rows]);
  const total = totalValue(rows);
  const day = rows.reduce((sum, row) => sum + row.day, 0);
  const dayBase = total - day;
  const dayPct = dayBase !== 0 ? (day / dayBase) * 100 : 0;
  const shownTotal = useCountUp(total);
  const cash = rows.find((row) => row.h.settlement);
  const openRow = rows.find((row) => row.h.id === openId) ?? null;

  const visible = useMemo(() => {
    const needle = fold(query.trim());
    const filtered = rows.filter((row) => {
      if (asset !== "all" && row.h.class !== asset) return false;
      if (!needle) return true;
      return fold(`${row.h.symbol} ${row.h.name} ${row.h.sector}`).includes(needle);
    });
    const ranked = [...filtered];
    ranked.sort((a, b) => compareRows(a, b, sort));
    return ranked;
  }, [rows, query, asset, sort]);

  const classes = ASSET_CLASSES.filter((item) => rows.some((row) => row.h.class === item));

  return (
    <div className="min-h-screen">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--color-ink)",
            color: "var(--color-foam)",
            border: "none",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-pine" aria-hidden>
              <span className="size-2.5 rounded-full bg-brass-bright" />
            </span>
            <div>
              <p className="font-display text-xl leading-none tracking-wide text-ink">Aurea</p>
              <p className="mt-1 text-xs text-muted">Sổ đầu tư thông minh</p>
            </div>
          </div>
          <Button className="pr-3.5 pl-4" onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Thêm
          </Button>
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:px-6">
          <div role="tablist" aria-label="Mục sổ" className="no-scrollbar flex gap-1 overflow-x-auto">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors",
                  tab === item.id ? "bg-pine text-foam shadow-card" : "text-ink-soft hover:bg-paper-2",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <section className="rise rounded-card bg-pine p-4 text-foam shadow-lift sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-foam-dim uppercase">Tổng giá trị</p>
              <p className="mt-1 font-display text-4xl tabular-nums sm:text-5xl">{formatVnd(shownTotal, { compact: true })}</p>
              <p className={cn("mt-2 text-sm font-semibold tabular-nums", toneText[pnlTone(day)])}>
                Phiên gần nhất {formatVnd(day, { signed: true, compact: true })}
                <span className="ml-2 font-medium">{formatPct(dayPct)}</span>
              </p>
            </div>
            <HealthRing score={health.score} label={health.label} onDark />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-foam/15 pt-4 sm:grid-cols-4">
            <HeroStat label="Tiền mặt" value={formatVnd(cash?.value ?? 0, { compact: true })} />
            <HeroStat label="Lãi chưa chốt" value={formatVnd(rows.reduce((sum, row) => sum + row.pnl, 0), { signed: true, compact: true })} />
            <HeroStat label="Vị thế lệch" value={String(rows.filter((row) => Math.abs(row.drift) >= 2).length)} />
            <HeroStat label="So với vốn đầu" value={initialCapital > 0 ? formatPct(((total - initialCapital) / initialCapital) * 100) : "—"} />
          </dl>
          <details className="capital-settings mt-4 rounded-control bg-pine-2">
            <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="flex min-w-0 items-center gap-2"><WalletCards className="size-4 shrink-0 text-brass-bright" /><span><b className="block text-foam">Thiết lập vốn</b><small className="block truncate text-xs text-foam-dim">Vốn đầu kỳ {formatVnd(initialCapital, { compact: true })} · dùng để đo hiệu suất</small></span></span>
              <span className="capital-chevron shrink-0 text-xs text-foam-dim">Mở</span>
            </summary>
            <div className="capital-editor flex flex-wrap items-center justify-between gap-3 border-t border-foam/10 px-3 py-3">
              <label className="text-xs text-foam-dim" htmlFor="initial-capital">Vốn ban đầu<br /><span>Nhập số tiền bằng VND</span></label>
              <div className="flex items-center gap-2">
                <input id="initial-capital" aria-label="Vốn ban đầu" inputMode="numeric" value={capitalDraft} onChange={(event) => setCapitalDraft(event.target.value)} className="h-10 w-36 rounded-control border border-foam/20 bg-pine px-3 text-right text-sm text-foam outline-none" />
                <button type="button" className="h-10 rounded-control bg-brass-bright px-3 text-sm font-bold text-pine" onClick={(event) => { const value = Number(capitalDraft.replace(/[^0-9.-]/g, "")); if (value >= 0) { setInitialCapital(value); (event.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open"); } }}>Lưu</button>
              </div>
            </div>
          </details>
        </section>

        <div className="mt-5" role="tabpanel">
          {tab === "cards" ? (
            <CardsView
              rows={visible}
              classes={classes}
              asset={asset}
              sort={sort}
              query={query}
              onQuery={setQuery}
              onAsset={setAsset}
              onSort={setSort}
              onOpen={(id) => {
                setOpenId(id);
              }}
            />
          ) : null}
          {tab === "journal" ? <JournalPanel txns={txns} holdings={holdings} initialCapital={initialCapital} /> : null}
          {tab === "overview" ? <OverviewPanel rows={rows} holdings={holdings} /> : null}
          {tab === "mix" ? <AllocationPanel rows={rows} /> : null}
          {tab === "insights" ? <InsightsPanel rows={rows} onOpen={setOpenId} /> : null}
        </div>

        <footer className="mt-10 flex flex-col gap-3 border-t border-line pt-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl leading-relaxed">
            {touched ? "Đã lưu trên trình duyệt này." : "Đang xem dữ liệu mẫu — sửa thoải mái, số sẽ được giữ lại trên máy bạn."} Aurea không phải lời khuyên đầu tư.
          </p>
          <button
            type="button"
            className="h-11 shrink-0 text-left font-semibold text-ink"
            onClick={() => {
              if (!armReset) {
                setArmReset(true);
                return;
              }
              reset();
              setArmReset(false);
              setOpenId(null);
            }}
          >
            {armReset ? "Xác nhận khôi phục mẫu" : "Khôi phục dữ liệu mẫu"}
          </button>
        </footer>
      </main>

      <HoldingSheet row={openRow} txns={txns} open={openRow !== null} onClose={() => setOpenId(null)} />
      <CreateDialog open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-foam-dim">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function CardsView({
  rows,
  classes,
  asset,
  sort,
  query,
  onQuery,
  onAsset,
  onSort,
  onOpen,
}: {
  rows: Row[];
  classes: AssetClass[];
  asset: AssetClass | "all";
  sort: SortKey;
  query: string;
  onQuery: (value: string) => void;
  onAsset: (value: AssetClass | "all") => void;
  onSort: (value: SortKey) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            id="aurea-search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Tìm mã, tên, nhóm"
            aria-label="Tìm vị thế"
            className="h-11 w-full rounded-control border border-line bg-card pr-3 pl-10 text-sm outline-none placeholder:text-muted"
          />
        </div>
        <label className="sr-only" htmlFor="aurea-sort">
          Sắp xếp
        </label>
        <select
          id="aurea-sort"
          value={sort}
          onChange={(event) => onSort(event.target.value as SortKey)}
          className="h-11 rounded-control border border-line bg-card px-3 text-sm"
        >
          <option value="value">Giá trị</option>
          <option value="gain">Lãi cao</option>
          <option value="loss">Lỗ nhiều</option>
          <option value="drift">Lệch mục tiêu</option>
          <option value="name">Tên</option>
        </select>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        <Chip active={asset === "all"} onClick={() => onAsset("all")}>
          Tất cả
        </Chip>
        {classes.map((item) => (
          <Chip key={item} active={asset === item} onClick={() => onAsset(item)}>
            {classLabel(item)}
          </Chip>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="mt-4 rounded-card border border-dashed border-line px-4 py-12 text-center">
          <p className="font-display text-2xl text-ink">Không có thẻ nào</p>
          <p className="mt-1 text-sm text-muted">Đổi bộ lọc, hoặc thêm một vị thế mới.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => (
            <HoldingCard key={row.h.id} row={row} delay={Math.min(index, 8) * 45} onOpen={onOpen} />
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-muted">
        Vạch đồng trên mỗi thẻ là mục tiêu. {rows.length} thẻ · nhấn <span className="font-semibold text-ink-soft">/</span> để tìm.
      </p>
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors",
        active ? "bg-ink text-foam" : "bg-card text-ink-soft shadow-card",
      )}
    >
      {children}
    </button>
  );
}

function compareRows(a: Row, b: Row, sort: SortKey): number {
  if (sort === "value") return b.value - a.value;
  if (sort === "gain") return b.pnlPct - a.pnlPct;
  if (sort === "loss") return a.pnlPct - b.pnlPct;
  if (sort === "drift") return Math.abs(b.drift) - Math.abs(a.drift);
  return a.h.name.localeCompare(b.h.name, "vi");
}
