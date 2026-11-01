export const ASSET_CLASSES = ["stock", "fund", "gold", "crypto", "forex", "bond", "cash"] as const;

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
  /** Đòn bẩy đang dùng cho Crypto/Forex; mặc định 1x khi chưa thiết lập. */
  leverage?: number;
  /** Rủi ro tài khoản dự kiến nếu vị thế chạm Stop Loss. */
  riskPct?: number;
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
  /** Ghi chú nhật ký giao dịch, tất cả đều tuỳ chọn để tương thích dữ liệu cũ. */
  setup?: string;
  timeframe?: string;
  emotion?: string;
  thesis?: string;
  stopLoss?: number;
  takeProfit?: number;
  riskPct?: number;
  exitReason?: string;
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
  leverage?: number;
  riskPct?: number;
};
