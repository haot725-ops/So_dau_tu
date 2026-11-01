export const ASSET_CLASSES = ["stock", "fund", "gold", "crypto", "bond", "cash"] as const;

export type AssetClass = (typeof ASSET_CLASSES)[number];

export type Holding = {
  id: string;
  symbol: string;
  name: string;
  class: AssetClass;
  sector: string;
  quantity: number;
  avgCost: number;
  price: number;
  targetWeight: number;
  spark: number[];
  note: string;
  realized: number;
  /** Ví tiền mặt dùng để khớp lệnh mua/bán. */
  settlement: boolean;
};

export type Txn = {
  id: string;
  holdingId: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  date: string;
  /** true nếu lệnh đã cộng/trừ tiền mặt. */
  linked: boolean;
};

export type HoldingDraft = {
  symbol: string;
  name: string;
  class: AssetClass;
  sector: string;
  quantity: number;
  avgCost: number;
  price: number;
  targetWeight: number;
  note: string;
  fundFromCash: boolean;
};
