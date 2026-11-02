import { PriceChart } from "@/components/aurea/charts";
import { Button, Field, TextInput } from "@/components/aurea/ui";
import { classLabel, formatDate, formatMoney, formatNum, formatPct, formatQty, formatQuotePrice, formatVnd, pnlTone, todayISO } from "@/lib/portfolio/format";
import type { Row } from "@/lib/portfolio/math";
import { usePortfolio } from "@/lib/portfolio/store";
import { ASSET_CLASSES, type AssetClass, type Txn } from "@/lib/portfolio/types";
import { cn } from "@/lib/cn";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const toneClass = { up: "text-up", down: "text-down", flat: "text-muted" } as const;

export function HoldingSheet({
  row,
  txns,
  open,
  onClose,
}: {
  row: Row | null;
  txns: Txn[];
  open: boolean;
  onClose: () => void;
}) {
  const trade = usePortfolio((state) => state.trade);
  const setPrice = usePortfolio((state) => state.setPrice);
  const updateProfile = usePortfolio((state) => state.updateProfile);
  const removeHolding = usePortfolio((state) => state.removeHolding);
  const displayCurrency = usePortfolio((state) => state.displayCurrency);
  const usdVndRate = usePortfolio((state) => state.usdVndRate);
  const [last, setLast] = useState<Row | null>(row);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [qty, setQty] = useState("");
  const [price, setPriceInput] = useState("");
  const [mark, setMark] = useState("");
  const [date, setDate] = useState(todayISO());
  const [journal, setJournal] = useState({ setup: "", timeframe: "", emotion: "", thesis: "", stopLoss: "", takeProfit: "", riskPct: "" });
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [profile, setProfile] = useState({ symbol: "", name: "", asset: "stock" as AssetClass, sector: "", note: "", balance: "", leverage: "1", riskPct: "" });

  useEffect(() => {
    if (row) setLast(row);
  }, [row]);

  const shown = row ?? last;

  useEffect(() => {
    if (!shown) return;
    setSide("buy");
    setQty("");
    setPriceInput(String(shown.h.price));
    setMark(String(shown.h.price));
    setDate(todayISO());
    setJournal({ setup: "", timeframe: "", emotion: "", thesis: "", stopLoss: "", takeProfit: "", riskPct: "" });
    setError("");
    setConfirmDelete(false);
    setProfile({
      symbol: shown.h.symbol,
      name: shown.h.name,
      asset: shown.h.class,
      sector: shown.h.sector,
      note: shown.h.note,
      balance: String(shown.h.quantity),
      leverage: String(shown.h.leverage ?? 1),
      riskPct: shown.h.riskPct ? String(shown.h.riskPct) : "",
    });
  }, [shown]);

  if (!shown) return null;
  const holding = shown.h;
  const history = txns.filter((txn) => txn.holdingId === holding.id).slice(0, 8);
  const tone = pnlTone(shown.pnl);

  function submitTrade() {
    const quantity = Number(qty.replace(",", "."));
    const tradePrice = Number(price.replace(",", "."));
    const result = trade({
      holdingId: holding.id,
      side,
      quantity,
      price: tradePrice,
      date,
      setup: journal.setup,
      timeframe: journal.timeframe,
      emotion: journal.emotion,
      thesis: journal.thesis,
      stopLoss: Number(journal.stopLoss.replace(",", ".")) || undefined,
      takeProfit: Number(journal.takeProfit.replace(",", ".")) || undefined,
      riskPct: Number(journal.riskPct.replace(",", ".")) || undefined,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setQty("");
    toast.success(result.message);
  }

  function commitPrice() {
    const next = Number(mark.replace(",", "."));
    if (!(next > 0)) {
      toast.error("Giá không hợp lệ.");
      return;
    }
    if (next === holding.price) {
      toast("Giá không đổi.");
      return;
    }
    setPrice(holding.id, next);
    toast.success(`Giá ${holding.symbol} cập nhật ${formatQuotePrice(holding, next, displayCurrency, usdVndRate)}`);
  }

  function saveProfile() {
    const balance = Number(profile.balance.replace(",", "."));
    if (holding.settlement && !(balance >= 0)) {
      toast.error("Số dư không hợp lệ.");
      return;
    }
    updateProfile(holding.id, {
      symbol: profile.symbol || holding.symbol,
      name: profile.name || holding.name,
      class: profile.asset,
      sector: profile.sector || holding.sector,
      note: profile.note,
      targetWeight: holding.targetWeight,
      balance: holding.settlement ? balance : undefined,
      leverage: Number(profile.leverage.replace(",", ".")) || 1,
      riskPct: profile.riskPct.trim() ? Number(profile.riskPct.replace(",", ".")) : 0,
    });
    toast.success("Đã lưu hồ sơ.");
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="sheet-panel fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-lift outline-none">
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="font-display text-3xl leading-none tracking-tight text-ink">{holding.symbol}</Dialog.Title>
              <Dialog.Description className="mt-1 truncate text-sm text-ink-soft">{holding.name}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="soft" className="size-11 shrink-0 px-0" aria-label="Đóng">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overscroll-contain overflow-y-auto px-5 py-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Giá trị</p>
                <p className="font-display text-4xl tabular-nums text-ink">{formatMoney(shown.value, displayCurrency, usdVndRate, { compact: true })}</p>
              </div>
              <div className={cn("text-right text-sm font-semibold tabular-nums", toneClass[tone])}>
                <div>{holding.class === "cash" ? "Không lãi lỗ" : formatPct(shown.pnlPct)}</div>
                <div>{holding.class === "cash" ? formatMoney(shown.value, displayCurrency, usdVndRate) : formatMoney(shown.pnl, displayCurrency, usdVndRate, { signed: true, compact: true })}</div>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Tỷ trọng" value={`${formatNum(shown.weight)}%`} />
              <Stat label="Mục tiêu" value={`${formatNum(shown.target)}%`} />
              <Stat label="Số lượng" value={formatQty(holding)} />
              <Stat label="Giá vốn" value={holding.class === "cash" ? "—" : formatQuotePrice(holding, holding.avgCost, displayCurrency, usdVndRate)} />
              <Stat label="Đã chốt" value={formatMoney(holding.realized, displayCurrency, usdVndRate, { signed: true, compact: true })} />
              <Stat label="Phiên gần nhất" value={formatMoney(shown.day, displayCurrency, usdVndRate, { signed: true, compact: true })} />
              <Stat label="Đòn bẩy" value={holding.settlement ? "—" : `${holding.leverage ?? 1}x`} />
              <Stat label="Rủi ro / SL" value={holding.settlement ? "—" : holding.riskPct ? `${formatNum(holding.riskPct)}%` : "Chưa đặt"} />
            </dl>

            <div className="mt-5">
              <div className="mb-1 flex items-center justify-between text-xs text-muted">
                <span>Mục tiêu tỷ trọng</span>
                <span className="shrink-0 tabular-nums font-semibold text-ink">{formatNum(holding.targetWeight, 0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={holding.targetWeight}
                aria-label="Mục tiêu tỷ trọng"
                className="w-full"
                onChange={(event) =>
                  updateProfile(holding.id, {
                    symbol: holding.symbol,
                    name: holding.name,
                    class: holding.class,
                    sector: holding.sector,
                    note: holding.note,
                    targetWeight: Number(event.target.value),
                  })
                }
              />
              <p className="text-xs text-muted">Vạch đồng trên thẻ là mục tiêu. Aurea chuẩn hóa để tổng mục tiêu thành 100%.</p>
            </div>

            {holding.class !== "cash" ? (
              <div className="mt-5">
                <PriceChart holding={holding} />
              </div>
            ) : null}

            {holding.class !== "cash" ? (
              <section className="mt-6">
                <h3 className="font-display text-xl text-ink">Ghi lệnh</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["buy", "sell"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSide(option)}
                      className={cn(
                        "h-11 rounded-control text-sm font-semibold transition-colors",
                        side === option ? "bg-pine text-foam" : "bg-paper-2 text-ink-soft",
                      )}
                    >
                      {option === "buy" ? "Mua" : "Bán"}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid gap-3">
                  <Field label="Số lượng" hint={holding.class === "stock" || holding.class === "fund" ? "Làm tròn xuống số nguyên." : undefined}>
                    <TextInput inputMode="decimal" value={qty} onChange={(event) => setQty(event.target.value)} placeholder="0" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Giá">
                      <TextInput inputMode="decimal" value={price} onChange={(event) => setPriceInput(event.target.value)} />
                    </Field>
                    <Field label="Ngày">
                      <TextInput type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                    </Field>
                  </div>
                  <div className="rounded-control bg-paper px-3 py-3">
                    <p className="text-xs font-semibold tracking-wide text-brass uppercase">Nhật ký lệnh</p>
                    <div className="mt-3 grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Setup">
                          <select className="h-11 w-full rounded-control border border-line bg-card px-3 text-sm" value={journal.setup} onChange={(event) => setJournal({ ...journal, setup: event.target.value })}>
                            <option value="">Chọn setup</option><option>Breakout</option><option>Pullback</option><option>Trend following</option><option>Reversal</option><option>Range</option>
                          </select>
                        </Field>
                        <Field label="Phong cách">
                          <select className="h-11 w-full rounded-control border border-line bg-card px-3 text-sm" value={journal.timeframe} onChange={(event) => setJournal({ ...journal, timeframe: event.target.value })}>
                            <option value="">Chọn kiểu</option><option>Scalp</option><option>Intraday</option><option>Swing</option><option>Position</option>
                          </select>
                        </Field>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Field label="Stop loss"><TextInput inputMode="decimal" value={journal.stopLoss} onChange={(event) => setJournal({ ...journal, stopLoss: event.target.value })} placeholder="—" /></Field>
                        <Field label="Take profit"><TextInput inputMode="decimal" value={journal.takeProfit} onChange={(event) => setJournal({ ...journal, takeProfit: event.target.value })} placeholder="—" /></Field>
                        <Field label="Rủi ro %"><TextInput inputMode="decimal" value={journal.riskPct} onChange={(event) => setJournal({ ...journal, riskPct: event.target.value })} placeholder="1" /></Field>
                      </div>
                      <Field label="Tâm lý">
                        <select className="h-11 w-full rounded-control border border-line bg-card px-3 text-sm" value={journal.emotion} onChange={(event) => setJournal({ ...journal, emotion: event.target.value })}>
                          <option value="">Chọn trạng thái</option><option>Bình tĩnh</option><option>Tự tin</option><option>Sợ bỏ lỡ (FOMO)</option><option>Trả thù thị trường</option><option>Do dự</option>
                        </select>
                      </Field>
                      <Field label="Luận điểm / lý do vào lệnh" hint="Ghi ngắn gọn để sau này biết mình đúng hay sai ở đâu.">
                        <textarea rows={2} value={journal.thesis} onChange={(event) => setJournal({ ...journal, thesis: event.target.value })} className="w-full rounded-control border border-line bg-card px-3 py-2 text-sm outline-none" placeholder="Ví dụ: giá retest vùng breakout, xu hướng lớn vẫn tăng…" />
                      </Field>
                    </div>
                  </div>
                  {error ? <p className="text-sm text-down">{error}</p> : null}
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={submitTrade}>
                      Ghi sổ
                    </Button>
                    <Button variant="soft" onClick={() => setQty(String(holding.quantity))}>
                      Bán hết
                    </Button>
                  </div>
                  <p className="text-xs text-muted">Lệnh mua trừ tiền mặt, lệnh bán cộng tiền mặt. Không gửi ra sàn.</p>
                </div>
              </section>
            ) : null}

            <section className="mt-6">
              <h3 className="font-display text-xl text-ink">Cập nhật giá</h3>
              <div className="mt-3 flex gap-2">
                <TextInput inputMode="decimal" value={mark} onChange={(event) => setMark(event.target.value)} disabled={holding.settlement} />
                <Button variant="soft" onClick={commitPrice} disabled={holding.settlement}>
                  Lưu giá
                </Button>
              </div>
            </section>

            <section className="mt-6">
              <h3 className="font-display text-xl text-ink">Sổ lệnh</h3>
              {history.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Chưa có lệnh.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line">
                  {history.map((txn) => (
                    <li key={txn.id} className="flex items-baseline justify-between gap-3 py-2.5 text-sm">
                      <div>
                        <span className="font-semibold text-ink">{txn.side === "buy" ? "Mua" : "Bán"}</span>
                        <span className="text-muted"> · {formatDate(txn.date)}</span>
                        <div className="text-xs text-muted">{txn.linked ? "Đã khớp tiền mặt" : "Ghi nhận số dư"}{txn.setup ? ` · ${txn.setup}` : ""}{txn.emotion ? ` · ${txn.emotion}` : ""}</div>
                        {txn.thesis ? <div className="mt-1 max-w-[16rem] text-xs leading-relaxed text-ink-soft">“{txn.thesis}”</div> : null}
                      </div>
                      <div className="text-right tabular-nums">
                        <div>{formatQty({ class: holding.class, quantity: txn.quantity })}</div>
                        <div className="text-xs text-muted">{formatVnd(txn.price)}{txn.riskPct ? ` · Rủi ro ${txn.riskPct}%` : ""}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <details className="mt-6 border-t border-line pt-3">
              <summary className="flex h-11 cursor-pointer items-center justify-between text-sm font-semibold">
                Hồ sơ vị thế
                <span className="text-xs font-medium text-muted">{classLabel(holding.class)}</span>
              </summary>
              <div className="grid gap-3 pt-3">
                <Field label="Mã">
                  <TextInput value={profile.symbol} onChange={(event) => setProfile({ ...profile, symbol: event.target.value })} />
                </Field>
                <Field label="Tên">
                  <TextInput value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Loại">
                    <select
                      className="h-11 w-full rounded-control border border-line bg-card px-3 text-sm"
                      value={profile.asset}
                      disabled={holding.settlement}
                      onChange={(event) => setProfile({ ...profile, asset: event.target.value as AssetClass })}
                    >
                      {ASSET_CLASSES.map((asset) => (
                        <option key={asset} value={asset}>
                          {classLabel(asset)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Nhóm">
                    <TextInput value={profile.sector} onChange={(event) => setProfile({ ...profile, sector: event.target.value })} />
                  </Field>
                </div>
                {!holding.settlement ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Đòn bẩy" hint="1x nếu không dùng margin.">
                      <TextInput inputMode="decimal" value={profile.leverage} onChange={(event) => setProfile({ ...profile, leverage: event.target.value })} />
                    </Field>
                    <Field label="Rủi ro %" hint="Rủi ro nếu chạm SL.">
                      <TextInput inputMode="decimal" value={profile.riskPct} onChange={(event) => setProfile({ ...profile, riskPct: event.target.value })} placeholder="Chưa đặt" />
                    </Field>
                  </div>
                ) : null}
                {holding.settlement ? (
                  <Field label="Số dư tiền mặt" hint="Nạp hoặc rút bằng cách sửa số này.">
                    <TextInput inputMode="decimal" value={profile.balance} onChange={(event) => setProfile({ ...profile, balance: event.target.value })} />
                  </Field>
                ) : (
                  <p className="text-xs text-muted">Số lượng và giá vốn chỉ đổi qua lệnh mua hoặc bán.</p>
                )}
                <Field label="Ghi chú">
                  <textarea
                    value={profile.note}
                    onChange={(event) => setProfile({ ...profile, note: event.target.value })}
                    rows={3}
                    className="w-full rounded-control border border-line bg-card px-3 py-2 text-sm text-ink outline-none"
                  />
                </Field>
                <Button variant="soft" onClick={saveProfile}>
                  Lưu hồ sơ
                </Button>
              </div>
            </details>

            {holding.note ? <p className="mt-4 rounded-control bg-brass-soft px-3 py-3 text-sm leading-relaxed text-ink">{holding.note}</p> : null}

            <div className="mt-6 border-t border-line pt-4">
              {confirmDelete ? (
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      removeHolding(holding.id);
                      toast("Đã xóa khỏi sổ.");
                      onClose();
                    }}
                  >
                    Xóa hẳn
                  </Button>
                  <Button variant="soft" onClick={() => setConfirmDelete(false)}>
                    Giữ lại
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" className="text-down" onClick={() => setConfirmDelete(true)}>
                  Xóa vị thế khỏi sổ
                </Button>
              )}
              <p className="mt-2 text-xs text-muted">Xóa không cộng số dư vào tiền mặt. Muốn chốt, hãy bán trước.</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-control bg-paper px-3 py-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  );
}
