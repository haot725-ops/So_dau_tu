import type { Holding, Txn } from "@/lib/portfolio/types";

function makeSpark(price: number, periodReturn: number, daily: number): number[] {
  const prev = price / (1 + daily);
  const start = price / (1 + periodReturn);
  const n = 14;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = Math.min(1, i / (n - 2));
    const wave = Math.sin(i * 1.15 + (price % 7)) * 0.008;
    let value = (start + (prev - start) * t) * (1 + (i === n - 1 ? 0 : wave));
    if (i === n - 2) value = prev;
    if (i === n - 1) value = price;
    out.push(Math.round(value));
  }
  out[n - 2] = Math.round(prev);
  out[n - 1] = price;
  return out;
}

const BLUEPRINT: Holding[] = [
  {
    id: "fpt",
    symbol: "FPT",
    name: "FPT Corporation",
    class: "stock",
    sector: "Công nghệ",
    quantity: 800,
    avgCost: 98500,
    price: 142500,
    targetWeight: 14,
    spark: makeSpark(142500, 0.08, 0.011),
    note: "Trụ công nghệ. Không mua thêm nếu tỷ trọng vượt 16%.",
    realized: 4_200_000,
    settlement: false,
  },
  {
    id: "vnm",
    symbol: "VNM",
    name: "Vinamilk",
    class: "stock",
    sector: "Tiêu dùng",
    quantity: 500,
    avgCost: 71200,
    price: 68400,
    targetWeight: 6,
    spark: makeSpark(68400, -0.02, -0.006),
    note: "Đang dưới giá vốn nhẹ. Giữ vì cổ tức, chưa trung bình giá.",
    realized: 0,
    settlement: false,
  },
  {
    id: "hpg",
    symbol: "HPG",
    name: "Hòa Phát",
    class: "stock",
    sector: "Công nghiệp",
    quantity: 1800,
    avgCost: 24100,
    price: 27800,
    targetWeight: 7,
    spark: makeSpark(27800, 0.05, 0.008),
    note: "Theo chu kỳ thép. Tỷ trọng gần mục tiêu.",
    realized: 0,
    settlement: false,
  },
  {
    id: "mwg",
    symbol: "MWG",
    name: "Thế Giới Di Động",
    class: "stock",
    sector: "Bán lẻ",
    quantity: 350,
    avgCost: 70100,
    price: 64200,
    targetWeight: 4,
    spark: makeSpark(64200, -0.06, -0.012),
    note: "Bán lẻ còn yếu. Không trung bình giá khi chưa thấy lãi biên cải thiện.",
    realized: 0,
    settlement: false,
  },
  {
    id: "acb",
    symbol: "ACB",
    name: "Ngân hàng Á Châu",
    class: "stock",
    sector: "Ngân hàng",
    quantity: 1400,
    avgCost: 22300,
    price: 25600,
    targetWeight: 5,
    spark: makeSpark(25600, 0.03, 0.004),
    note: "Ngân hàng tư nhân. Giữ như dòng cổ tức.",
    realized: 0,
    settlement: false,
  },
  {
    id: "vcb",
    symbol: "VCB",
    name: "Vietcombank",
    class: "stock",
    sector: "Ngân hàng",
    quantity: 280,
    avgCost: 86800,
    price: 91500,
    targetWeight: 5,
    spark: makeSpark(91500, 0.025, 0.003),
    note: "Thiếu một chút so với mục tiêu. Có thể mua dần.",
    realized: 1_200_000,
    settlement: false,
  },
  {
    id: "gold",
    symbol: "SJC",
    name: "Vàng miếng SJC",
    class: "gold",
    sector: "Kim loại quý",
    quantity: 2.4,
    avgCost: 81_200_000,
    price: 92_400_000,
    targetWeight: 22,
    spark: makeSpark(92_400_000, 0.035, 0.0015),
    note: "Phòng thủ. Mục tiêu 22% — đang dư, cân nhắc chốt một phần.",
    realized: 6_500_000,
    settlement: false,
  },
  {
    id: "etf",
    symbol: "E1VFVN30",
    name: "DCVFM VN30 ETF",
    class: "fund",
    sector: "Chỉ số",
    quantity: 1500,
    avgCost: 23800,
    price: 26150,
    targetWeight: 8,
    spark: makeSpark(26150, 0.04, 0.007),
    note: "Lõi chỉ số. Đang thiếu tỷ trọng so với mục tiêu.",
    realized: 0,
    settlement: false,
  },
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    class: "crypto",
    sector: "Tài sản số",
    quantity: 0.055,
    avgCost: 1_920_000_000,
    price: 2_640_000_000,
    targetWeight: 15,
    spark: makeSpark(2_640_000_000, 0.14, -0.018),
    note: "Vị thế vệ tinh. Không để vượt 20% danh mục.",
    realized: 0,
    settlement: false,
  },
  {
    id: "cash",
    symbol: "VND",
    name: "Tiền mặt",
    class: "cash",
    sector: "Thanh khoản",
    quantity: 120_000_000,
    avgCost: 1,
    price: 1,
    targetWeight: 14,
    spark: Array.from({ length: 14 }, () => 1),
    note: "Đệm mua khi thị trường điều chỉnh. Khớp mọi lệnh mua bán.",
    realized: 0,
    settlement: true,
  },
];

const TXNS: Txn[] = [
  { id: "t1", holdingId: "fpt", side: "buy", quantity: 800, price: 98500, date: "2025-11-12", linked: false },
  { id: "t2", holdingId: "vnm", side: "buy", quantity: 500, price: 71200, date: "2026-01-20", linked: false },
  { id: "t3", holdingId: "hpg", side: "buy", quantity: 1800, price: 24100, date: "2026-02-11", linked: false },
  { id: "t4", holdingId: "mwg", side: "buy", quantity: 350, price: 70100, date: "2026-03-04", linked: false },
  { id: "t5", holdingId: "acb", side: "buy", quantity: 1400, price: 22300, date: "2025-12-02", linked: false },
  { id: "t6", holdingId: "vcb", side: "buy", quantity: 280, price: 86800, date: "2026-01-08", linked: false },
  { id: "t7", holdingId: "gold", side: "buy", quantity: 2.4, price: 81_200_000, date: "2025-09-18", linked: false },
  { id: "t8", holdingId: "etf", side: "buy", quantity: 1500, price: 23800, date: "2026-04-16", linked: false },
  { id: "t9", holdingId: "btc", side: "buy", quantity: 0.055, price: 1_920_000_000, date: "2026-05-22", linked: false },
];

export function seedHoldings(): Holding[] {
  return BLUEPRINT.map((holding) => ({ ...holding, spark: [...holding.spark] }));
}

export function seedTxns(): Txn[] {
  return TXNS.map((txn) => ({ ...txn }));
}

export function blankSpark(price: number): number[] {
  return makeSpark(price, 0.01, 0);
}
