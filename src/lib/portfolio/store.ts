import { formatQty, formatVnd, todayISO } from "@/lib/portfolio/format";
import { rebalancePlans, roundQty, type Plan } from "@/lib/portfolio/math";
import { blankSpark, seedHoldings, seedTxns } from "@/lib/portfolio/seed";
import type { Holding, HoldingDraft, Txn } from "@/lib/portfolio/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TradeInput = {
  holdingId: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  date: string;
};

type TradeOk = { ok: true; holdings: Holding[]; txns: Txn[]; message: string };
type TradeFail = { ok: false; error: string };

export type PortfolioState = {
  holdings: Holding[];
  txns: Txn[];
  touched: boolean;
  addHolding: (draft: HoldingDraft) => { ok: true } | TradeFail;
  updateProfile: (
    id: string,
    patch: Pick<Holding, "symbol" | "name" | "class" | "sector" | "note" | "targetWeight"> & { balance?: number },
  ) => void;
  setPrice: (id: string, price: number) => void;
  removeHolding: (id: string) => void;
  trade: (input: TradeInput) => { ok: true; message: string } | TradeFail;
  rebalance: (date: string) => { ok: true; done: number; skipped: number } | TradeFail;
  reset: () => void;
};

function cloneHoldings(holdings: Holding[]): Holding[] {
  return holdings.map((holding) => ({ ...holding, spark: [...holding.spark] }));
}

function makeSettlement(amount: number): Holding {
  return {
    id: `cash-${crypto.randomUUID().slice(0, 8)}`,
    symbol: "VND",
    name: "Tiền mặt",
    class: "cash",
    sector: "Thanh khoản",
    quantity: Math.round(amount),
    avgCost: 1,
    price: 1,
    targetWeight: 10,
    spark: Array.from({ length: 14 }, () => 1),
    note: "Ví khớp lệnh.",
    realized: 0,
    settlement: true,
  };
}

function applyTrade(holdings: Holding[], txns: Txn[], input: TradeInput): TradeOk | TradeFail {
  const index = holdings.findIndex((holding) => holding.id === input.holdingId);
  if (index < 0) return { ok: false, error: "Không tìm thấy vị thế." };
  const current = holdings[index]!;
  if (current.settlement) {
    return { ok: false, error: "Tiền mặt không mua bán như chứng khoán. Sửa số dư trong hồ sơ." };
  }
  if (!(input.quantity > 0) || !(input.price > 0)) {
    return { ok: false, error: "Số lượng và giá phải lớn hơn 0." };
  }
  const qty = roundQty(current, input.quantity);
  if (qty <= 0) return { ok: false, error: "Số lượng quá nhỏ sau khi làm tròn." };
  const value = Math.round(qty * input.price);
  const next = cloneHoldings(holdings);
  let cashIndex = next.findIndex((holding) => holding.settlement);
  if (cashIndex < 0) {
    next.push(makeSettlement(0));
    cashIndex = next.length - 1;
  }
  const target = next[index]!;
  const cash = next[cashIndex]!;
  if (input.side === "buy") {
    if (cash.quantity + 1e-6 < value) {
      return { ok: false, error: `Thiếu ${formatVnd(value - cash.quantity)} tiền mặt.` };
    }
    const newQty = target.quantity + qty;
    target.avgCost = target.quantity <= 0 ? input.price : (target.avgCost * target.quantity + input.price * qty) / newQty;
    target.quantity = newQty;
    cash.quantity = Math.round(cash.quantity - value);
  } else {
    if (qty > target.quantity + 1e-8) return { ok: false, error: "Không đủ số lượng để bán." };
    target.realized += (input.price - target.avgCost) * qty;
    target.quantity = Math.max(0, target.quantity - qty);
    cash.quantity = Math.round(cash.quantity + value);
  }
  if (input.price !== target.price) target.spark = [...target.spark.slice(1), input.price];
  target.price = input.price;
  const txn: Txn = {
    id: crypto.randomUUID(),
    holdingId: target.id,
    side: input.side,
    quantity: qty,
    price: input.price,
    date: input.date,
    linked: true,
  };
  const verb = input.side === "buy" ? "Mua" : "Bán";
  return {
    ok: true,
    holdings: next,
    txns: [txn, ...txns],
    message: `${verb} ${formatQty({ class: target.class, quantity: qty })} ${target.symbol}`,
  };
}

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set, get) => ({
      holdings: seedHoldings(),
      txns: seedTxns(),
      touched: false,
      addHolding: (draft) => {
        const isCash = draft.class === "cash";
        const holding: Holding = {
          id: `${draft.symbol.toLowerCase()}-${crypto.randomUUID().slice(0, 4)}`,
          symbol: draft.symbol.trim().toUpperCase(),
          name: draft.name.trim(),
          class: draft.class,
          sector: draft.sector.trim(),
          quantity: isCash || !draft.fundFromCash ? draft.quantity : 0,
          avgCost: isCash ? 1 : draft.fundFromCash ? draft.price : draft.avgCost,
          price: isCash ? 1 : draft.price,
          targetWeight: draft.targetWeight,
          spark: isCash ? Array.from({ length: 14 }, () => 1) : blankSpark(draft.price),
          note: draft.note.trim(),
          realized: 0,
          settlement: false,
        };
        if (isCash || !draft.fundFromCash) {
          const txn: Txn = {
            id: crypto.randomUUID(),
            holdingId: holding.id,
            side: "buy",
            quantity: holding.quantity,
            price: holding.price,
            date: todayISO(),
            linked: false,
          };
          set({ holdings: [...get().holdings, holding], txns: [txn, ...get().txns], touched: true });
          return { ok: true };
        }
        const staged = [...get().holdings, holding];
        const traded = applyTrade(staged, get().txns, {
          holdingId: holding.id,
          side: "buy",
          quantity: draft.quantity,
          price: draft.price,
          date: todayISO(),
        });
        if (!traded.ok) return traded;
        set({ holdings: traded.holdings, txns: traded.txns, touched: true });
        return { ok: true };
      },
      updateProfile: (id, patch) => {
        set({
          touched: true,
          holdings: get().holdings.map((holding) => {
            if (holding.id !== id) return holding;
            const next: Holding = {
              ...holding,
              symbol: patch.symbol.trim().toUpperCase(),
              name: patch.name.trim(),
              class: holding.settlement ? "cash" : patch.class,
              sector: patch.sector.trim(),
              note: patch.note,
              targetWeight: patch.targetWeight,
            };
            if (holding.settlement && patch.balance !== undefined && patch.balance >= 0) {
              next.quantity = Math.round(patch.balance);
              next.price = 1;
              next.avgCost = 1;
            }
            return next;
          }),
        });
      },
      setPrice: (id, price) => {
        if (!(price > 0)) return;
        set({
          touched: true,
          holdings: get().holdings.map((holding) => {
            if (holding.id !== id || holding.settlement) return holding;
            return { ...holding, price, spark: [...holding.spark.slice(1), price] };
          }),
        });
      },
      removeHolding: (id) => {
        const target = get().holdings.find((holding) => holding.id === id);
        if (!target) return;
        set({
          touched: true,
          holdings: get().holdings.filter((holding) => holding.id !== id),
          txns: get().txns.filter((txn) => txn.holdingId !== id),
        });
      },
      trade: (input) => {
        const result = applyTrade(get().holdings, get().txns, input);
        if (!result.ok) return result;
        set({ holdings: result.holdings, txns: result.txns, touched: true });
        return { ok: true, message: result.message };
      },
      rebalance: (date) => {
        const plans = rebalancePlans(get().holdings);
        if (plans.length === 0) return { ok: false, error: "Danh mục đã sát mục tiêu." };
        const ordered: Plan[] = [
          ...plans.filter((plan) => plan.side === "sell").sort((a, b) => b.value - a.value),
          ...plans.filter((plan) => plan.side === "buy").sort((a, b) => a.value - b.value),
        ];
        let holdings = get().holdings;
        let txns = get().txns;
        let done = 0;
        let skipped = 0;
        for (const plan of ordered) {
          const result = applyTrade(holdings, txns, {
            holdingId: plan.holdingId,
            side: plan.side,
            quantity: plan.quantity,
            price: plan.price,
            date,
          });
          if (!result.ok) {
            skipped += 1;
            continue;
          }
          holdings = result.holdings;
          txns = result.txns;
          done += 1;
        }
        if (done === 0) return { ok: false, error: "Không đủ tiền mặt để thực hiện các lệnh gợi ý." };
        set({ holdings, txns, touched: true });
        return { ok: true, done, skipped };
      },
      reset: () => set({ holdings: seedHoldings(), txns: seedTxns(), touched: false }),
    }),
    {
      name: "aurea-portfolio-v1",
      skipHydration: true,
      partialize: (state) => ({
        holdings: state.holdings,
        txns: state.txns,
        touched: state.touched,
      }),
    },
  ),
);
