import { Button, Field, TextInput } from "@/components/aurea/ui";
import { classLabel } from "@/lib/portfolio/format";
import { usePortfolio } from "@/lib/portfolio/store";
import { ASSET_CLASSES, type AssetClass, type MarketType, type PositionSide } from "@/lib/portfolio/types";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  symbol: z.string().trim().min(1, "Nhập mã").max(12, "Mã tối đa 12 ký tự"),
  name: z.string().trim().min(1, "Nhập tên"),
  asset: z.enum(ASSET_CLASSES),
  sector: z.string().trim().min(1, "Nhập nhóm"),
  quantity: z.number().positive("Số lượng phải lớn hơn 0"),
  avgCost: z.number().positive("Giá vốn phải lớn hơn 0"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  targetWeight: z.number().min(0, "Từ 0 đến 100").max(100, "Từ 0 đến 100"),
  leverage: z.number().positive("Đòn bẩy phải lớn hơn 0"),
  riskPct: z.number().min(0, "Từ 0 đến 100").max(100, "Từ 0 đến 100"),
  market: z.enum(["spot", "futures"]),
  direction: z.enum(["long", "short"]),
  note: z.string().max(280, "Ghi chú tối đa 280 ký tự"),
  fundFromCash: z.boolean(),
});

const empty = {
  symbol: "",
  name: "",
  asset: "stock" as AssetClass,
  sector: "",
  quantity: "",
  avgCost: "",
  price: "",
  targetWeight: "5",
  leverage: "1",
  riskPct: "",
  market: "spot" as MarketType,
  direction: "long" as PositionSide,
  note: "",
  fundFromCash: false,
};

function toNumber(raw: string): number {
  const value = Number(raw.replace(",", ".").trim());
  return Number.isFinite(value) ? value : Number.NaN;
}

export function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addHolding = usePortfolio((state) => state.addHolding);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cash = form.asset === "cash";

  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
    }
  }, [open]);

  function submit() {
    const parsed = schema.safeParse({
      symbol: form.symbol,
      name: form.name,
      asset: form.asset,
      sector: form.sector,
      quantity: toNumber(form.quantity),
      avgCost: cash ? 1 : toNumber(form.avgCost),
      price: cash ? 1 : toNumber(form.price),
      targetWeight: toNumber(form.targetWeight),
      leverage: toNumber(form.leverage),
      riskPct: form.riskPct.trim() ? toNumber(form.riskPct) : 0,
      market: form.market,
      direction: form.direction,
      note: form.note,
      fundFromCash: cash ? false : form.fundFromCash,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    const result = addHolding({
      symbol: parsed.data.symbol,
      name: parsed.data.name,
      class: parsed.data.asset,
      sector: parsed.data.sector,
      quantity: parsed.data.quantity,
      avgCost: parsed.data.avgCost,
      price: parsed.data.price,
      targetWeight: parsed.data.targetWeight,
      note: parsed.data.note,
      fundFromCash: parsed.data.fundFromCash,
      leverage: parsed.data.leverage,
      riskPct: parsed.data.riskPct || undefined,
      market: parsed.data.market,
      direction: parsed.data.direction,
    });
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    toast.success(`Đã thêm ${parsed.data.symbol.toUpperCase()}`);
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="pop-panel fixed top-1/2 left-1/2 z-50 max-h-[min(100dvh-2rem,44rem)] w-[min(100%-2rem,34rem)] overflow-y-auto rounded-card bg-card p-5 shadow-lift outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-display text-3xl text-ink">Thêm vị thế</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">Ghi một khoản đang nắm, hoặc mua mới bằng tiền mặt.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="soft" className="size-11 px-0" aria-label="Đóng">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="mt-5 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mã" error={errors.symbol}>
                <TextInput value={form.symbol} onChange={(event) => setForm({ ...form, symbol: event.target.value })} placeholder="BTCUSDT / EURUSD" />
              </Field>
              <Field label="Loại" error={errors.asset}>
                <select
                  className="h-11 w-full rounded-control border border-line bg-card px-3 text-sm"
                  value={form.asset}
                  onChange={(event) => setForm({ ...form, asset: event.target.value as AssetClass })}
                >
                  {ASSET_CLASSES.map((asset) => (
                    <option key={asset} value={asset}>
                      {classLabel(asset)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Tên" error={errors.name}>
              <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Tên đầy đủ" />
            </Field>
            <Field label="Nhóm" error={errors.sector}>
              <TextInput value={form.sector} list="aurea-sectors" onChange={(event) => setForm({ ...form, sector: event.target.value })} placeholder="Crypto, Forex, Công nghệ…" />
              <datalist id="aurea-sectors">
                {["Công nghệ", "Ngân hàng", "Tiêu dùng", "Bán lẻ", "Công nghiệp", "Kim loại quý", "Chỉ số", "Tài sản số", "Forex", "Thanh khoản"].map((sector) => (
                  <option key={sector} value={sector} />
                ))}
              </datalist>
            </Field>
            {form.asset === "crypto" || form.asset === "forex" ? (
              <div className="rounded-card bg-paper p-3">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Cấu hình vị thế</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="grid grid-cols-2 gap-1 rounded-control bg-paper-2 p-1">
                    {(["spot", "futures"] as const).map((market) => (
                      <button key={market} type="button" onClick={() => setForm({ ...form, market })} className={`h-9 rounded-md text-xs font-semibold ${form.market === market ? "bg-pine text-foam" : "text-ink-soft"}`}>
                        {market === "spot" ? "Spot" : "Futures"}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 rounded-control bg-paper-2 p-1">
                    {(["long", "short"] as const).map((direction) => (
                      <button key={direction} type="button" onClick={() => setForm({ ...form, direction })} className={`h-9 rounded-md text-xs font-semibold ${form.direction === direction ? (direction === "long" ? "bg-moss text-ink" : "bg-rose text-foam") : "text-ink-soft"}`}>
                        {direction === "long" ? "Long ↗" : "Short ↘"}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted">{form.market === "futures" ? "Dùng giá Mark và có thể áp dụng đòn bẩy." : "Mua và nắm giữ tài sản cơ sở, mặc định 1x."}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <Field label={cash ? "Số dư" : "Số lượng"} error={errors.quantity}>
                <TextInput inputMode="decimal" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} placeholder={cash ? "50000000" : "100"} />
              </Field>
              <Field label="Mục tiêu %" error={errors.targetWeight}>
                <TextInput inputMode="decimal" value={form.targetWeight} onChange={(event) => setForm({ ...form, targetWeight: event.target.value })} />
              </Field>
            </div>
            {cash ? null : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Giá vốn" error={errors.avgCost} hint="Giá mỗi đơn vị, không viết dấu chấm nghìn.">
                  <TextInput inputMode="decimal" value={form.avgCost} onChange={(event) => setForm({ ...form, avgCost: event.target.value })} placeholder="98500" />
                </Field>
                <Field label="Giá hiện tại" error={errors.price}>
                  <TextInput inputMode="decimal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="142500" />
                </Field>
              </div>
            )}
            {cash ? null : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Đòn bẩy" error={errors.leverage} hint="Ví dụ 1, 5 hoặc 10 lần.">
                  <TextInput inputMode="decimal" value={form.leverage} onChange={(event) => setForm({ ...form, leverage: event.target.value })} placeholder="1" />
                </Field>
                <Field label="Rủi ro %" error={errors.riskPct} hint="Mất bao nhiêu % tài khoản nếu chạm SL.">
                  <TextInput inputMode="decimal" value={form.riskPct} onChange={(event) => setForm({ ...form, riskPct: event.target.value })} placeholder="1" />
                </Field>
              </div>
            )}
            <Field label="Ghi chú" error={errors.note}>
              <textarea
                value={form.note}
                rows={2}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                className="w-full rounded-control border border-line bg-card px-3 py-2 text-sm outline-none"
              />
            </Field>
            {cash ? null : (
              <label className="flex items-start gap-3 rounded-control bg-paper px-3 py-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-pine"
                  checked={form.fundFromCash}
                  onChange={(event) => setForm({ ...form, fundFromCash: event.target.checked })}
                />
                <span>
                  <span className="font-semibold text-ink">Mua bằng tiền mặt</span>
                  <span className="mt-0.5 block text-muted">Bỏ chọn nếu bạn chỉ ghi nhận vị thế đang có, không trừ ví.</span>
                </span>
              </label>
            )}
            {errors.form ? <p className="text-sm text-down">{errors.form}</p> : null}
            <Button className="w-full" onClick={submit}>
              Thêm vào sổ
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
