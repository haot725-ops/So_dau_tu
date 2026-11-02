import { CreateDialog } from "@/components/aurea/create-dialog";
import { HoldingCard } from "@/components/aurea/holding-card";
import { HoldingSheet } from "@/components/aurea/holding-sheet";
import { JournalPanel } from "@/components/aurea/journal-panel";
import { AllocationPanel, InsightsPanel, OverviewPanel } from "@/components/aurea/panels";
import { Button, HealthRing, useCountUp } from "@/components/aurea/ui";
import { classLabel, fold, formatMoney, formatPct, pnlTone } from "@/lib/portfolio/format";
import { healthOf, rowsOf, totalValue, type Row } from "@/lib/portfolio/math";
import { usePortfolio } from "@/lib/portfolio/store";
import { ASSET_CLASSES, type AssetClass } from "@/lib/portfolio/types";
import { cn } from "@/lib/cn";
import { CircleAlert, CircleCheck, Plus, RefreshCw, Search, Settings, WalletCards, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

function bitgetSymbol(symbol: string): string {
  const normalized = symbol.toUpperCase().replace(/[-_]/g, "").replaceAll("/", "");
  return normalized.endsWith("USDT") ? normalized : `${normalized}USDT`;
}

export function AureaApp() {
  const holdings = usePortfolio((state) => state.holdings);
  const txns = usePortfolio((state) => state.txns);
  const initialCapital = usePortfolio((state) => state.initialCapital);
  const displayCurrency = usePortfolio((state) => state.displayCurrency);
  const usdVndRate = usePortfolio((state) => state.usdVndRate);
  const setInitialCapital = usePortfolio((state) => state.setInitialCapital);
  const setDisplayCurrency = usePortfolio((state) => state.setDisplayCurrency);
  const setUsdVndRate = usePortfolio((state) => state.setUsdVndRate);
  const setPrice = usePortfolio((state) => state.setPrice);
  const reset = usePortfolio((state) => state.reset);
  const [tab, setTab] = useState<Tab>("cards");
  const [slide, setSlide] = useState<"next" | "prev">("next");
  const [query, setQuery] = useState("");
  const [asset, setAsset] = useState<AssetClass | "all">("all");
  const [sort, setSort] = useState<SortKey>("value");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [armReset, setArmReset] = useState(false);
  const [capitalDraft, setCapitalDraft] = useState(String(initialCapital));
  const [priceSync, setPriceSync] = useState<{ state: "idle" | "syncing" | "live" | "error"; at: number | null; message: string }>({ state: "idle", at: null, message: "Đang chuẩn bị" });
  const tabRef = useRef<Tab>(tab);
  tabRef.current = tab;
  const holdingsRef = useRef(holdings);
  holdingsRef.current = holdings;

  function goTab(next: Tab) {
    const from = TABS.findIndex((item) => item.id === tabRef.current);
    const to = TABS.findIndex((item) => item.id === next);
    if (from === to) return;
    setSlide(to > from ? "next" : "prev");
    setTab(next);
  }

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

  useEffect(() => {
    const blockGesture = (event: Event) => event.preventDefault();
    const blockWheelZoom = (event: WheelEvent) => { if (event.ctrlKey) event.preventDefault(); };
    document.addEventListener("gesturestart", blockGesture, { passive: false });
    document.addEventListener("gesturechange", blockGesture, { passive: false });
    document.addEventListener("gestureend", blockGesture, { passive: false });
    document.addEventListener("wheel", blockWheelZoom, { passive: false });
    return () => {
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      document.removeEventListener("gestureend", blockGesture);
      document.removeEventListener("wheel", blockWheelZoom);
    };
  }, []);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startT = 0;
    let tracking = false;
    const isIgnoredStart = (target: EventTarget | null) => {
      let node = target instanceof HTMLElement ? target : null;
      if (!node) return true;
      if (node.closest("input, textarea, select, [role=\"dialog\"], [role=\"menu\"], .native-overlay, [data-no-swipe], .recharts-wrapper")) return true;
      while (node) {
        const style = window.getComputedStyle(node);
        if ((style.overflowX === "auto" || style.overflowX === "scroll") && node.scrollWidth > node.clientWidth + 1) return true;
        node = node.parentElement;
      }
      return false;
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || isIgnoredStart(event.target)) { tracking = false; return; }
      const touch = event.touches[0];
      startX = touch.clientX; startY = touch.clientY; startT = Date.now(); tracking = true;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking || event.changedTouches.length !== 1) return;
      tracking = false;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 64 || Math.abs(dx) < 1.6 * Math.abs(dy) || Date.now() - startT > 700) return;
      const index = TABS.findIndex((item) => item.id === tabRef.current);
      const next = TABS[index + (dx < 0 ? 1 : -1)];
      if (next) goTab(next.id);
    };
    const onTouchCancel = () => { tracking = false; };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchCancel);
    };
  }, []);

  useEffect(() => {
    document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [tab]);

  const rows = useMemo(() => rowsOf(holdings, usdVndRate), [holdings, usdVndRate]);
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
  const marketKeys = useMemo(() => rows.filter((row) => row.h.class === "crypto").map((row) => `${bitgetSymbol(row.h.symbol)}|${row.h.market ?? "spot"}`).sort().join(","), [rows]);

  useEffect(() => {
    const pairs = marketKeys.split(",").filter(Boolean).map((key) => {
      const [symbol, market] = key.split("|");
      return { symbol: symbol!, market: market === "futures" ? "futures" : "spot" };
    });
    if (!pairs.length) {
      setPriceSync({ state: "idle", at: null, message: "Chưa có mã Crypto" });
      return;
    }
    let cancelled = false;
    const sync = async () => {
      if (!cancelled) setPriceSync((current) => ({ ...current, state: "syncing", message: "Đang lấy giá Bitget…" }));
      let updated = 0;
      try {
        const fxResponse = await fetch("https://api.bitget.com/api/v3/market/tickers?category=SPOT&symbol=USDTVND");
        if (fxResponse.ok) {
          const fxPayload = (await fxResponse.json()) as { code?: string; data?: Array<{ lastPrice?: string }> };
          const fxRate = Number(fxPayload.data?.[0]?.lastPrice);
          if (fxPayload.code === "00000" && fxRate > 0) setUsdVndRate(fxRate);
        }
        await Promise.all(pairs.map(async ({ symbol, market }) => {
          const categories = market === "futures" ? ["USDT-FUTURES", "SPOT"] : ["SPOT", "USDT-FUTURES"];
          for (const category of categories) {
            const response = await fetch(`https://api.bitget.com/api/v3/market/tickers?category=${category}&symbol=${encodeURIComponent(symbol)}`);
            if (!response.ok) continue;
            const payload = (await response.json()) as { code?: string; data?: Array<{ symbol?: string; lastPrice?: string; markPrice?: string }> };
            const ticker = payload.data?.[0];
            const price = Number(ticker?.markPrice || ticker?.lastPrice);
            if (payload.code === "00000" && ticker?.symbol && price > 0) {
              const holding = holdingsRef.current.find((item) => bitgetSymbol(item.symbol) === symbol && (item.market ?? "spot") === market);
              if (holding) { setPrice(holding.id, price); updated += 1; }
              return;
            }
          }
        }));
        if (!cancelled) setPriceSync({ state: updated ? "live" : "error", at: updated ? Date.now() : null, message: updated ? `${updated}/${pairs.length} mã đang Live` : "Bitget chưa trả giá cho mã này" });
      } catch {
        if (!cancelled) setPriceSync({ state: "error", at: null, message: "Không kết nối được Bitget" });
      }
    };
    void sync();
    const timer = window.setInterval(() => void sync(), 60_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [marketKeys, setPrice, setUsdVndRate]);

  const priceSyncLabel = priceSync.at ? `${priceSync.message} · ${new Date(priceSync.at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : priceSync.message;

  return (
    <div className="min-h-dvh">
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
      <header className="sticky top-0 z-30 border-b border-line bg-paper sm:bg-paper/90 sm:backdrop-blur-md">
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
          <div className="flex items-center gap-2">
            <Button variant="soft" className="size-11 px-0" aria-label="Cài đặt" onClick={() => setSettingsOpen(true)}><Settings className="size-4" /></Button>
            <Button className="pr-3.5 pl-4" onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Thêm
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:px-6">
          <div role="tablist" aria-label="Mục sổ" data-no-swipe className="no-scrollbar overscroll-x-contain flex gap-1 overflow-x-auto">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => goTab(item.id)}
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

      <main data-native-scroll className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        {tab === "cards" ? <section className="rise rounded-card bg-pine p-4 text-foam shadow-lift sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-foam-dim uppercase">Tổng giá trị</p>
              <p className="mt-1 font-display text-4xl tabular-nums sm:text-5xl">{formatMoney(shownTotal, displayCurrency, usdVndRate, { compact: true })}</p>
              <p className={cn("mt-2 text-sm font-semibold tabular-nums", toneText[pnlTone(day)])}>
                Phiên gần nhất {formatMoney(day, displayCurrency, usdVndRate, { signed: true, compact: true })}
                <span className="ml-2 font-medium">{formatPct(dayPct)}</span>
              </p>
            </div>
            <HealthRing score={health.score} label={health.label} onDark />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-foam/15 pt-3 text-xs">
            {priceSync.state === "live" ? <CircleCheck className="size-3.5 text-mint" /> : priceSync.state === "error" ? <CircleAlert className="size-3.5 text-rose" /> : <RefreshCw className={cn("size-3.5 text-foam-dim", priceSync.state === "syncing" && "animate-spin")} />}
            <span className="text-foam-dim">Bitget · {priceSyncLabel}</span>
            <span className="rounded-full bg-pine-2 px-2 py-1 text-[10px] font-semibold text-foam-dim">Tự cập nhật 60s</span>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-foam/15 pt-4 sm:grid-cols-4">
            <HeroStat label="Tiền mặt" value={formatMoney(cash?.value ?? 0, displayCurrency, usdVndRate, { compact: true })} />
            <HeroStat label="Lãi chưa chốt" value={formatMoney(rows.reduce((sum, row) => sum + row.pnl, 0), displayCurrency, usdVndRate, { signed: true, compact: true })} />
            <HeroStat label="Vị thế lệch" value={String(rows.filter((row) => Math.abs(row.drift) >= 2).length)} />
            <HeroStat label="So với vốn đầu" value={initialCapital > 0 && total > 0 ? formatPct(((total - initialCapital) / initialCapital) * 100) : "—"} />
          </dl>
        </section> : null}

        <div key={tab} className={cn(tab === "cards" ? "mt-5" : "mt-0", slide === "next" ? "tab-in-next" : "tab-in-prev")} role="tabpanel">
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

      </main>

      <HoldingSheet row={openRow} txns={txns} open={openRow !== null} onClose={() => setOpenId(null)} />
      <CreateDialog open={creating} onClose={() => setCreating(false)} />
      {settingsOpen ? <div className="native-overlay fixed inset-0 z-50 overflow-y-auto bg-ink/40 p-3 sm:p-4" onClick={() => setSettingsOpen(false)}><section className="native-sheet mx-auto mt-auto box-border w-full max-w-lg overflow-hidden rounded-card bg-card p-4 shadow-lift sm:p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-display text-3xl text-ink">Cài đặt</h2><p className="mt-1 text-sm text-muted">Vốn, đơn vị hiển thị và dữ liệu cục bộ.</p></div><button type="button" className="grid size-11 shrink-0 place-items-center rounded-control bg-paper-2" onClick={() => setSettingsOpen(false)} aria-label="Đóng"><X className="size-4" /></button></div>
        <div className="mt-5 grid min-w-0 gap-4"><div className="min-w-0 rounded-card bg-paper p-4"><div className="flex items-center gap-2"><WalletCards className="size-4 shrink-0 text-brass" /><b>Vốn ban đầu</b></div><div className="mt-3 flex min-w-0 gap-2"><input aria-label="Vốn ban đầu" inputMode="numeric" value={capitalDraft} onChange={(event) => setCapitalDraft(event.target.value)} className="h-11 min-w-0 flex-1 rounded-control border border-line bg-card px-3 text-right outline-none" /><button type="button" className="h-11 shrink-0 rounded-control bg-pine px-4 font-semibold text-foam" onClick={() => { const value = Number(capitalDraft.replace(/[^0-9.-]/g, "")); if (value >= 0) setInitialCapital(value); }}>Lưu</button></div><p className="mt-2 truncate text-xs text-muted">Đang lưu theo VND · {formatMoney(initialCapital, displayCurrency, usdVndRate, { compact: true })}</p></div><div className="min-w-0 rounded-card bg-paper p-4"><div className="flex flex-wrap items-center justify-between gap-2"><b>Đơn vị hiển thị</b><div className="flex shrink-0 gap-1 rounded-full bg-paper-2 p-1">{(["VND", "USD"] as const).map((currency) => <button key={currency} type="button" onClick={() => setDisplayCurrency(currency)} className={cn("rounded-full px-3 py-1.5 text-xs font-bold", displayCurrency === currency ? "bg-pine text-foam" : "text-ink-soft")}>{currency}</button>)}</div></div><label className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted"><span className="min-w-0">Tỷ giá Bitget USDT/VND</span><span className="flex shrink-0 items-center gap-1"><input aria-label="Tỷ giá USD VND" inputMode="numeric" value={usdVndRate} onChange={(event) => setUsdVndRate(Number(event.target.value.replace(/[^0-9]/g, "")))} className="h-10 w-28 rounded-control border border-line bg-card px-2 py-2 text-right text-ink" /> ₫/$</span></label><p className="mt-2 text-xs text-muted">Tự cập nhật theo cặp USDT/VND của Bitget mỗi 60 giây.</p></div><button type="button" className="h-11 w-full rounded-control border border-down/30 text-sm font-semibold text-down" onClick={() => { if (!armReset) { setArmReset(true); return; } reset(); setArmReset(false); setSettingsOpen(false); setOpenId(null); }}>{armReset ? "Bấm lần nữa để xác nhận" : "Khôi phục dữ liệu mẫu"}</button></div>
      </section></div> : null}
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
  const [sortOpen, setSortOpen] = useState(false);
  const sortLabels: Record<SortKey, string> = { value: "Giá trị", gain: "Lãi cao", loss: "Lỗ nhiều", drift: "Lệch mục tiêu", name: "Tên" };
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
        <div className="relative shrink-0">
          <button type="button" aria-haspopup="menu" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)} className="flex h-11 w-full items-center justify-between gap-3 rounded-control border border-line bg-card px-3 text-sm sm:w-40"><span>{sortLabels[sort]}</span><span className="text-xs text-muted">⌄</span></button>
          {sortOpen ? <div role="menu" className="native-popover absolute top-12 right-0 z-20 min-w-full overflow-hidden rounded-control bg-card p-1 shadow-lift sm:w-44">{(Object.keys(sortLabels) as SortKey[]).map((key) => <button key={key} type="button" role="menuitemradio" aria-checked={sort === key} onClick={() => { onSort(key); setSortOpen(false); }} className={cn("block h-10 w-full rounded-md px-3 text-left text-sm", sort === key ? "bg-pine text-foam" : "text-ink-soft hover:bg-paper-2")}>{sortLabels[key]}</button>)}</div> : null}
        </div>
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
