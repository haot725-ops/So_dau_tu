import { DEFAULT_USD_VND_RATE, formatNum, formatVnd, sessionLabels } from "@/lib/portfolio/format";
import type { AssetClass, Holding } from "@/lib/portfolio/types";

export type Row = {
  h: Holding;
  value: number;
  weight: number;
  target: number;
  drift: number;
  pnl: number;
  pnlPct: number;
  day: number;
};

export type Factor = {
  id: string;
  label: string;
  score: number;
  detail: string;
};

export type Insight = {
  id: string;
  tone: "good" | "warn" | "neutral";
  title: string;
  body: string;
  holdingId?: string;
};

export type Plan = {
  holdingId: string;
  symbol: string;
  name: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  value: number;
  class: AssetClass;
};

export type ShockId = "equities" | "gold" | "crypto" | "banks";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function roundQty(holding: Holding, qty: number): number {
  if (!(qty > 0)) return 0;
  if (holding.class === "crypto") return Math.floor(qty * 1e6 + 1e-8) / 1e6;
  if (holding.class === "gold") return Math.floor(qty * 100 + 1e-8) / 100;
  return Math.floor(qty + 1e-8);
}

export function rowsOf(holdings: Holding[], usdVndRate = DEFAULT_USD_VND_RATE): Row[] {
  const valueOf = (holding: Holding, price: number) => price * holding.quantity * (holding.quoteCurrency === "USD" ? usdVndRate : 1);
  const total = holdings.reduce((sum, holding) => sum + valueOf(holding, holding.price), 0);
  const targetSum = holdings.reduce((sum, holding) => sum + holding.targetWeight, 0) || 1;
  return holdings.map((holding) => {
    const value = valueOf(holding, holding.price);
    const weight = total > 0 ? (value / total) * 100 : 0;
    const target = (holding.targetWeight / targetSum) * 100;
    const direction = holding.direction === "short" ? -1 : 1;
    const pnl = holding.class === "cash" ? 0 : (holding.price - holding.avgCost) * holding.quantity * direction * (holding.quoteCurrency === "USD" ? usdVndRate : 1);
    const pnlPct =
      holding.class === "cash" || holding.avgCost <= 0 ? 0 : ((holding.price - holding.avgCost) / holding.avgCost) * 100 * direction;
    const prev = holding.spark.length > 1 ? holding.spark[holding.spark.length - 2]! : holding.price;
    const day = (holding.price - prev) * holding.quantity;
    return { h: holding, value, weight, target, drift: weight - target, pnl, pnlPct, day };
  });
}

export function totalValue(rows: Row[]): number {
  return rows.reduce((sum, row) => sum + row.value, 0);
}

export function healthOf(rows: Row[]): { score: number; label: string; factors: Factor[] } {
  if (rows.length === 0) {
    return {
      score: 0,
      label: "Trống",
      factors: [],
    };
  }
  const hhi = rows.reduce((sum, row) => sum + (row.weight / 100) ** 2, 0);
  const divScore = clamp((0.55 - hhi) / 0.4, 0, 1) * 100;
  const cashW = rows.find((row) => row.h.settlement)?.weight ?? 0;
  let cashScore = 100;
  if (cashW < 8) cashScore = (cashW / 8) * 100;
  else if (cashW > 22) cashScore = clamp(1 - (cashW - 22) / 30, 0, 1) * 100;

  const driftRow = rows.reduce((best, row) => (Math.abs(row.drift) > Math.abs(best.drift) ? row : best), rows[0]!);
  const maxDrift = Math.abs(driftRow.drift);
  const driftScore = clamp(1 - maxDrift / 12, 0, 1) * 100;

  const risk = rows.filter((row) => !row.h.settlement);
  const maxRisk = risk.length ? Math.max(...risk.map((row) => row.weight)) : 0;
  const concScore = maxRisk <= 22 ? 100 : clamp(1 - (maxRisk - 22) / 28, 0, 1) * 100;

  const score = Math.round(divScore * 0.3 + cashScore * 0.2 + driftScore * 0.3 + concScore * 0.2);
  const label = score >= 85 ? "Vững" : score >= 70 ? "Khá cân" : score >= 50 ? "Đang lệch" : "Mong manh";

  return {
    score,
    label,
    factors: [
      {
        id: "div",
        label: "Đa dạng",
        score: Math.round(divScore),
        detail: `HHI ${formatNum(hhi, 2)} — càng thấp, danh mục càng trải đều.`,
      },
      {
        id: "cash",
        label: "Đệm tiền mặt",
        score: Math.round(cashScore),
        detail: `Tiền mặt ${formatNum(cashW)}%. Vùng dễ chịu là 8–22%.`,
      },
      {
        id: "drift",
        label: "Sát mục tiêu",
        score: Math.round(driftScore),
        detail: `Lệch lớn nhất ${formatNum(maxDrift)} điểm % ở ${driftRow.h.symbol}.`,
      },
      {
        id: "conc",
        label: "Không tập trung",
        score: Math.round(concScore),
        detail: `Vị thế lớn nhất chiếm ${formatNum(maxRisk)}%.`,
      },
    ],
  };
}

export function buildInsights(rows: Row[]): Insight[] {
  if (rows.length === 0) {
    return [
      {
        id: "empty",
        tone: "neutral",
        title: "Sổ đang trống",
        body: "Thêm một vị thế hoặc khôi phục dữ liệu mẫu để Aurea đọc danh mục.",
      },
    ];
  }
  const total = totalValue(rows);
  const insights: Insight[] = [];
  const ranked = [...rows].sort((a, b) => b.drift - a.drift);
  const over = ranked.find((row) => !row.h.settlement && row.drift >= 3);
  const under = [...ranked].reverse().find((row) => !row.h.settlement && row.drift <= -3);

  if (over) {
    const trim = (over.drift / 100) * total;
    insights.push({
      id: `over-${over.h.id}`,
      tone: "warn",
      title: `${over.h.symbol} đang dư ${formatNum(over.drift)} điểm %`,
      body: `${over.h.name} chiếm ${formatNum(over.weight)}%, mục tiêu là ${formatNum(over.target)}%. Chốt khoảng ${formatVnd(trim, { compact: true })} sẽ kéo tỷ trọng về vùng bạn đã đặt.`,
      holdingId: over.h.id,
    });
  }
  if (under) {
    const gap = (Math.abs(under.drift) / 100) * total;
    insights.push({
      id: `under-${under.h.id}`,
      tone: "neutral",
      title: `${under.h.symbol} đang thiếu ${formatNum(Math.abs(under.drift))} điểm %`,
      body: `Muốn về mục tiêu ${formatNum(under.target)}% thì cần thêm khoảng ${formatVnd(gap, { compact: true })}. Làm dần, đừng dồn một lệnh.`,
      holdingId: under.h.id,
    });
  }

  const winner = [...rows].filter((row) => row.h.class !== "cash").sort((a, b) => b.pnlPct - a.pnlPct)[0];
  if (winner && winner.pnlPct >= 25) {
    insights.push({
      id: `win-${winner.h.id}`,
      tone: "good",
      title: `${winner.h.symbol} lãi ${formatNum(winner.pnlPct)}% so với giá vốn`,
      body: `Lãi chưa chốt ${formatVnd(winner.pnl, { signed: true, compact: true })}. Nếu đây là vị thế biến động, chốt một phần sẽ khóa lời mà không rời bỏ hết.`,
      holdingId: winner.h.id,
    });
  }

  const loser = [...rows].filter((row) => row.h.class !== "cash").sort((a, b) => a.pnlPct - b.pnlPct)[0];
  if (loser && loser.pnlPct <= -5) {
    insights.push({
      id: `loss-${loser.h.id}`,
      tone: "warn",
      title: `${loser.h.symbol} đang lỗ ${formatNum(Math.abs(loser.pnlPct))}%`,
      body: `${loser.h.name} dưới giá vốn ${formatVnd(Math.abs(loser.pnl), { compact: true })}. Trung bình giá chỉ nên làm khi luận điểm còn nguyên — không phải vì muốn hòa vốn.`,
      holdingId: loser.h.id,
    });
  }

  const cash = rows.find((row) => row.h.settlement);
  if (cash) {
    const comfortable = cash.weight >= 8 && cash.weight <= 22;
    insights.push({
      id: "cash",
      tone: comfortable ? "good" : "warn",
      title: comfortable ? `Tiền mặt ${formatNum(cash.weight)}% — đủ đệm` : `Tiền mặt ${formatNum(cash.weight)}% lệch vùng đệm`,
      body: comfortable
        ? "Đủ để mua khi thị trường giật, mà không để vốn chết quá nhiều. Vùng Aurea coi là dễ chịu: 8–22%."
        : cash.weight < 8
          ? "Đệm mỏng. Một nhịp giảm mạnh sẽ không còn tiền để mua. Cân nhắc chốt vị thế đang dư."
          : "Tiền mặt dày hơn mức cần. Nếu không chờ một cơ hội cụ thể, hãy đưa dần vào mục tiêu đang thiếu.",
      holdingId: cash.h.id,
    });
  }

  const sectors = new Map<string, number>();
  for (const row of rows) {
    if (row.h.settlement) continue;
    sectors.set(row.h.sector, (sectors.get(row.h.sector) ?? 0) + row.weight);
  }
  const topSector = [...sectors.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topSector && topSector[1] >= 28) {
    insights.push({
      id: "sector",
      tone: "warn",
      title: `Nhóm ${topSector[0]} chiếm ${formatNum(topSector[1])}%`,
      body: "Một nhóm vượt 28% thì danh mục đi theo đúng câu chuyện đó. Ổn nếu bạn chủ đích, rủi ro nếu chỉ là hệ quả của giá tăng.",
    });
  }

  return insights;
}

export function rebalancePlans(holdings: Holding[], usdVndRate = DEFAULT_USD_VND_RATE): Plan[] {
  const rows = rowsOf(holdings, usdVndRate);
  const total = totalValue(rows);
  if (total <= 0) return [];
  const plans: Plan[] = [];
  for (const row of rows) {
    if (row.h.settlement || row.h.price <= 0) continue;
    const deltaValue = ((row.target - row.weight) / 100) * total;
    if (Math.abs(deltaValue) < Math.max(500_000, total * 0.004)) continue;
    const quantity = roundQty(row.h, Math.abs(deltaValue) / row.h.price);
    if (quantity <= 0) continue;
    if (deltaValue < 0 && quantity > row.h.quantity) continue;
    plans.push({
      holdingId: row.h.id,
      symbol: row.h.symbol,
      name: row.h.name,
      side: deltaValue > 0 ? "buy" : "sell",
      quantity,
      price: row.h.price,
      value: Math.round(quantity * row.h.price),
      class: row.h.class,
    });
  }
  return plans.sort((a, b) => b.value - a.value);
}

export function shockedValue(rows: Row[], shock: ShockId): number {
  return rows.reduce((sum, row) => {
    let factor = 1;
    if (shock === "equities" && (row.h.class === "stock" || row.h.class === "fund" || row.h.class === "bond")) factor = 0.9;
    if (shock === "gold" && row.h.class === "gold") factor = 0.95;
    if (shock === "crypto" && row.h.class === "crypto") factor = 0.75;
    if (shock === "banks" && row.h.sector === "Ngân hàng") factor = 0.92;
    return sum + row.value * factor;
  }, 0);
}

export function historyOf(holdings: Holding[]): { label: string; value: number }[] {
  const length = holdings.reduce((min, holding) => Math.min(min, holding.spark.length), 14);
  if (length <= 0) return [];
  const labels = sessionLabels(length);
  return labels.map((label, index) => {
    const value = holdings.reduce((sum, holding) => {
      const point = holding.spark[index + (holding.spark.length - length)] ?? holding.price;
      return sum + point * holding.quantity;
    }, 0);
    return { label, value };
  });
}
