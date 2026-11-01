import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as Plus, r as Search, t as X } from "../_libs/lucide-react.mjs";
import { a as object, i as number, n as boolean, o as string, t as _enum } from "../_libs/zod.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as PieChart, o as Pie, r as YAxis, s as Cell, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D09FqWXV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40", variant === "primary" && "bg-pine text-foam hover:bg-pine-2", variant === "ghost" && "bg-transparent text-ink hover:bg-paper-2", variant === "soft" && "bg-paper-2 text-ink hover:bg-line", variant === "danger" && "bg-down-soft text-down hover:bg-down hover:text-foam", className),
		...props
	});
}
function TextInput({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-control border border-line bg-card px-3 text-sm text-ink outline-none placeholder:text-muted", className),
		...props
	});
}
function Field({ label, hint, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-xs font-semibold tracking-wide text-muted uppercase",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs text-down",
				children: error
			}) : null,
			!error && hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function HealthRing({ score, label, onDark = false }) {
	const radius = 36;
	const circ = 2 * Math.PI * radius;
	const offset = circ * (1 - Math.max(0, Math.min(100, score)) / 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid size-24 shrink-0 place-items-center",
		"aria-label": `Điểm sức khỏe ${score}, ${label}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 88 88",
			className: "size-24 -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "44",
				cy: "44",
				r: radius,
				fill: "none",
				strokeWidth: "7",
				className: onDark ? "stroke-foam/15" : "stroke-paper-2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "44",
				cy: "44",
				r: radius,
				fill: "none",
				strokeWidth: "7",
				strokeLinecap: "round",
				strokeDasharray: circ,
				strokeDashoffset: offset,
				className: onDark ? "stroke-brass-bright" : "stroke-pine",
				style: { transition: "stroke-dashoffset 700ms cubic-bezier(0.2, 0, 0, 1)" }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("font-display text-2xl leading-none tabular-nums", onDark ? "text-foam" : "text-ink"),
				children: score
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("text-xs", onDark ? "text-foam-dim" : "text-muted"),
				children: label
			})]
		})]
	});
}
function useCountUp(value) {
	const [shown, setShown] = (0, import_react.useState)(value);
	const from = (0, import_react.useRef)(value);
	(0, import_react.useEffect)(() => {
		if (from.current === value) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const start = from.current;
		if (reduce) {
			from.current = value;
			setShown(value);
			return;
		}
		const t0 = performance.now();
		let frame = 0;
		const tick = (now) => {
			const p = Math.min(1, (now - t0) / 680);
			const eased = 1 - (1 - p) ** 3;
			setShown(start + (value - start) * eased);
			if (p < 1) frame = requestAnimationFrame(tick);
			else from.current = value;
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [value]);
	return shown;
}
function WeightBar({ actual, target }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-3",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-paper-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-pine",
				style: {
					width: `${Math.max(2, Math.min(100, actual))}%`,
					transition: "width 300ms ease-out"
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-0 h-3 w-0.5 -translate-x-1/2 rounded-full bg-brass",
			style: { left: `${Math.max(0, Math.min(100, target))}%` }
		})]
	});
}
function formatVnd(value, opts) {
	const abs = Math.abs(value);
	const sign = value < 0 ? "−" : opts?.signed && value > 0 ? "+" : "";
	if (opts?.compact) {
		if (abs >= 1e9) return `${sign}${(abs / 1e9).toLocaleString("vi-VN", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 0
		})} tỷ`;
		if (abs >= 1e6) return `${sign}${(abs / 1e6).toLocaleString("vi-VN", {
			maximumFractionDigits: 1,
			minimumFractionDigits: 0
		})} tr`;
	}
	return `${sign}${Math.round(abs).toLocaleString("vi-VN")} ₫`;
}
function formatNum(value, digits = 1) {
	return value.toLocaleString("vi-VN", {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	});
}
function formatPct(value, digits = 1) {
	return `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatNum(Math.abs(value), digits)}%`;
}
function formatQty(holding) {
	const digits = holding.class === "crypto" ? 4 : holding.class === "gold" ? 2 : 0;
	const num = holding.quantity.toLocaleString("vi-VN", {
		maximumFractionDigits: digits,
		minimumFractionDigits: 0
	});
	if (holding.class === "gold") return `${num} lượng`;
	if (holding.class === "crypto") return `${num} coin`;
	if (holding.class === "cash") return formatVnd(holding.quantity);
	return `${num} cp`;
}
function formatDate(iso) {
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return `${d}/${m}/${y}`;
}
function classLabel(asset) {
	switch (asset) {
		case "stock": return "Cổ phiếu";
		case "fund": return "Quỹ";
		case "gold": return "Vàng";
		case "crypto": return "Crypto";
		case "bond": return "Trái phiếu";
		case "cash": return "Tiền mặt";
	}
}
function pnlTone(value) {
	if (value > 1e-7) return "up";
	if (value < -1e-7) return "down";
	return "flat";
}
/** Phiên giao dịch lùi từ 30.10.2026, bỏ thứ 7 và chủ nhật. Cố định để SSR khớp client. */
function sessionLabels(count) {
	const labels = [];
	const cursor = new Date(Date.UTC(2026, 9, 30));
	while (labels.length < count) {
		const day = cursor.getUTCDay();
		if (day !== 0 && day !== 6) {
			const dd = String(cursor.getUTCDate()).padStart(2, "0");
			const mm = String(cursor.getUTCMonth() + 1).padStart(2, "0");
			labels.push(`${dd}/${mm}`);
		}
		cursor.setUTCDate(cursor.getUTCDate() - 1);
	}
	return labels.reverse();
}
function todayISO() {
	const now = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(now.getTime() - now.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}
function fold(value) {
	return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function roundQty(holding, qty) {
	if (!(qty > 0)) return 0;
	if (holding.class === "crypto") return Math.floor(qty * 1e6 + 1e-8) / 1e6;
	if (holding.class === "gold") return Math.floor(qty * 100 + 1e-8) / 100;
	return Math.floor(qty + 1e-8);
}
function rowsOf(holdings) {
	const total = holdings.reduce((sum, holding) => sum + holding.price * holding.quantity, 0);
	const targetSum = holdings.reduce((sum, holding) => sum + holding.targetWeight, 0) || 1;
	return holdings.map((holding) => {
		const value = holding.price * holding.quantity;
		const weight = total > 0 ? value / total * 100 : 0;
		const target = holding.targetWeight / targetSum * 100;
		const pnl = holding.class === "cash" ? 0 : (holding.price - holding.avgCost) * holding.quantity;
		const pnlPct = holding.class === "cash" || holding.avgCost <= 0 ? 0 : (holding.price - holding.avgCost) / holding.avgCost * 100;
		const prev = holding.spark.length > 1 ? holding.spark[holding.spark.length - 2] : holding.price;
		const day = (holding.price - prev) * holding.quantity;
		return {
			h: holding,
			value,
			weight,
			target,
			drift: weight - target,
			pnl,
			pnlPct,
			day
		};
	});
}
function totalValue(rows) {
	return rows.reduce((sum, row) => sum + row.value, 0);
}
function healthOf(rows) {
	if (rows.length === 0) return {
		score: 0,
		label: "Trống",
		factors: []
	};
	const hhi = rows.reduce((sum, row) => sum + (row.weight / 100) ** 2, 0);
	const divScore = clamp((.55 - hhi) / .4, 0, 1) * 100;
	const cashW = rows.find((row) => row.h.settlement)?.weight ?? 0;
	let cashScore = 100;
	if (cashW < 8) cashScore = cashW / 8 * 100;
	else if (cashW > 22) cashScore = clamp(1 - (cashW - 22) / 30, 0, 1) * 100;
	const driftRow = rows.reduce((best, row) => Math.abs(row.drift) > Math.abs(best.drift) ? row : best, rows[0]);
	const maxDrift = Math.abs(driftRow.drift);
	const driftScore = clamp(1 - maxDrift / 12, 0, 1) * 100;
	const risk = rows.filter((row) => !row.h.settlement);
	const maxRisk = risk.length ? Math.max(...risk.map((row) => row.weight)) : 0;
	const concScore = maxRisk <= 22 ? 100 : clamp(1 - (maxRisk - 22) / 28, 0, 1) * 100;
	const score = Math.round(divScore * .3 + cashScore * .2 + driftScore * .3 + concScore * .2);
	return {
		score,
		label: score >= 85 ? "Vững" : score >= 70 ? "Khá cân" : score >= 50 ? "Đang lệch" : "Mong manh",
		factors: [
			{
				id: "div",
				label: "Đa dạng",
				score: Math.round(divScore),
				detail: `HHI ${formatNum(hhi, 2)} — càng thấp, danh mục càng trải đều.`
			},
			{
				id: "cash",
				label: "Đệm tiền mặt",
				score: Math.round(cashScore),
				detail: `Tiền mặt ${formatNum(cashW)}%. Vùng dễ chịu là 8–22%.`
			},
			{
				id: "drift",
				label: "Sát mục tiêu",
				score: Math.round(driftScore),
				detail: `Lệch lớn nhất ${formatNum(maxDrift)} điểm % ở ${driftRow.h.symbol}.`
			},
			{
				id: "conc",
				label: "Không tập trung",
				score: Math.round(concScore),
				detail: `Vị thế lớn nhất chiếm ${formatNum(maxRisk)}%.`
			}
		]
	};
}
function buildInsights(rows) {
	if (rows.length === 0) return [{
		id: "empty",
		tone: "neutral",
		title: "Sổ đang trống",
		body: "Thêm một vị thế hoặc khôi phục dữ liệu mẫu để Aurea đọc danh mục."
	}];
	const total = totalValue(rows);
	const insights = [];
	const ranked = [...rows].sort((a, b) => b.drift - a.drift);
	const over = ranked.find((row) => !row.h.settlement && row.drift >= 3);
	const under = [...ranked].reverse().find((row) => !row.h.settlement && row.drift <= -3);
	if (over) {
		const trim = over.drift / 100 * total;
		insights.push({
			id: `over-${over.h.id}`,
			tone: "warn",
			title: `${over.h.symbol} đang dư ${formatNum(over.drift)} điểm %`,
			body: `${over.h.name} chiếm ${formatNum(over.weight)}%, mục tiêu là ${formatNum(over.target)}%. Chốt khoảng ${formatVnd(trim, { compact: true })} sẽ kéo tỷ trọng về vùng bạn đã đặt.`,
			holdingId: over.h.id
		});
	}
	if (under) {
		const gap = Math.abs(under.drift) / 100 * total;
		insights.push({
			id: `under-${under.h.id}`,
			tone: "neutral",
			title: `${under.h.symbol} đang thiếu ${formatNum(Math.abs(under.drift))} điểm %`,
			body: `Muốn về mục tiêu ${formatNum(under.target)}% thì cần thêm khoảng ${formatVnd(gap, { compact: true })}. Làm dần, đừng dồn một lệnh.`,
			holdingId: under.h.id
		});
	}
	const winner = [...rows].filter((row) => row.h.class !== "cash").sort((a, b) => b.pnlPct - a.pnlPct)[0];
	if (winner && winner.pnlPct >= 25) insights.push({
		id: `win-${winner.h.id}`,
		tone: "good",
		title: `${winner.h.symbol} lãi ${formatNum(winner.pnlPct)}% so với giá vốn`,
		body: `Lãi chưa chốt ${formatVnd(winner.pnl, {
			signed: true,
			compact: true
		})}. Nếu đây là vị thế biến động, chốt một phần sẽ khóa lời mà không rời bỏ hết.`,
		holdingId: winner.h.id
	});
	const loser = [...rows].filter((row) => row.h.class !== "cash").sort((a, b) => a.pnlPct - b.pnlPct)[0];
	if (loser && loser.pnlPct <= -5) insights.push({
		id: `loss-${loser.h.id}`,
		tone: "warn",
		title: `${loser.h.symbol} đang lỗ ${formatNum(Math.abs(loser.pnlPct))}%`,
		body: `${loser.h.name} dưới giá vốn ${formatVnd(Math.abs(loser.pnl), { compact: true })}. Trung bình giá chỉ nên làm khi luận điểm còn nguyên — không phải vì muốn hòa vốn.`,
		holdingId: loser.h.id
	});
	const cash = rows.find((row) => row.h.settlement);
	if (cash) {
		const comfortable = cash.weight >= 8 && cash.weight <= 22;
		insights.push({
			id: "cash",
			tone: comfortable ? "good" : "warn",
			title: comfortable ? `Tiền mặt ${formatNum(cash.weight)}% — đủ đệm` : `Tiền mặt ${formatNum(cash.weight)}% lệch vùng đệm`,
			body: comfortable ? "Đủ để mua khi thị trường giật, mà không để vốn chết quá nhiều. Vùng Aurea coi là dễ chịu: 8–22%." : cash.weight < 8 ? "Đệm mỏng. Một nhịp giảm mạnh sẽ không còn tiền để mua. Cân nhắc chốt vị thế đang dư." : "Tiền mặt dày hơn mức cần. Nếu không chờ một cơ hội cụ thể, hãy đưa dần vào mục tiêu đang thiếu.",
			holdingId: cash.h.id
		});
	}
	const sectors = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (row.h.settlement) continue;
		sectors.set(row.h.sector, (sectors.get(row.h.sector) ?? 0) + row.weight);
	}
	const topSector = [...sectors.entries()].sort((a, b) => b[1] - a[1])[0];
	if (topSector && topSector[1] >= 28) insights.push({
		id: "sector",
		tone: "warn",
		title: `Nhóm ${topSector[0]} chiếm ${formatNum(topSector[1])}%`,
		body: "Một nhóm vượt 28% thì danh mục đi theo đúng câu chuyện đó. Ổn nếu bạn chủ đích, rủi ro nếu chỉ là hệ quả của giá tăng."
	});
	return insights;
}
function rebalancePlans(holdings) {
	const rows = rowsOf(holdings);
	const total = totalValue(rows);
	if (total <= 0) return [];
	const plans = [];
	for (const row of rows) {
		if (row.h.settlement || row.h.price <= 0) continue;
		const deltaValue = (row.target - row.weight) / 100 * total;
		if (Math.abs(deltaValue) < Math.max(5e5, total * .004)) continue;
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
			class: row.h.class
		});
	}
	return plans.sort((a, b) => b.value - a.value);
}
function shockedValue(rows, shock) {
	return rows.reduce((sum, row) => {
		let factor = 1;
		if (shock === "equities" && (row.h.class === "stock" || row.h.class === "fund" || row.h.class === "bond")) factor = .9;
		if (shock === "gold" && row.h.class === "gold") factor = .95;
		if (shock === "crypto" && row.h.class === "crypto") factor = .75;
		if (shock === "banks" && row.h.sector === "Ngân hàng") factor = .92;
		return sum + row.value * factor;
	}, 0);
}
function historyOf(holdings) {
	const length = holdings.reduce((min, holding) => Math.min(min, holding.spark.length), 14);
	if (length <= 0) return [];
	return sessionLabels(length).map((label, index) => {
		return {
			label,
			value: holdings.reduce((sum, holding) => {
				return sum + (holding.spark[index + (holding.spark.length - length)] ?? holding.price) * holding.quantity;
			}, 0)
		};
	});
}
function makeSpark(price, periodReturn, daily) {
	const prev = price / (1 + daily);
	const start = price / (1 + periodReturn);
	const n = 14;
	const out = [];
	for (let i = 0; i < n; i++) {
		const t = Math.min(1, i / 12);
		const wave = Math.sin(i * 1.15 + price % 7) * .008;
		let value = (start + (prev - start) * t) * (1 + (i === 13 ? 0 : wave));
		if (i === 12) value = prev;
		if (i === 13) value = price;
		out.push(Math.round(value));
	}
	out[12] = Math.round(prev);
	out[13] = price;
	return out;
}
var BLUEPRINT = [
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
		spark: makeSpark(142500, .08, .011),
		note: "Trụ công nghệ. Không mua thêm nếu tỷ trọng vượt 16%.",
		realized: 42e5,
		settlement: false
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
		spark: makeSpark(68400, -.02, -.006),
		note: "Đang dưới giá vốn nhẹ. Giữ vì cổ tức, chưa trung bình giá.",
		realized: 0,
		settlement: false
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
		spark: makeSpark(27800, .05, .008),
		note: "Theo chu kỳ thép. Tỷ trọng gần mục tiêu.",
		realized: 0,
		settlement: false
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
		spark: makeSpark(64200, -.06, -.012),
		note: "Bán lẻ còn yếu. Không trung bình giá khi chưa thấy lãi biên cải thiện.",
		realized: 0,
		settlement: false
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
		spark: makeSpark(25600, .03, .004),
		note: "Ngân hàng tư nhân. Giữ như dòng cổ tức.",
		realized: 0,
		settlement: false
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
		spark: makeSpark(91500, .025, .003),
		note: "Thiếu một chút so với mục tiêu. Có thể mua dần.",
		realized: 12e5,
		settlement: false
	},
	{
		id: "gold",
		symbol: "SJC",
		name: "Vàng miếng SJC",
		class: "gold",
		sector: "Kim loại quý",
		quantity: 2.4,
		avgCost: 812e5,
		price: 924e5,
		targetWeight: 22,
		spark: makeSpark(924e5, .035, .0015),
		note: "Phòng thủ. Mục tiêu 22% — đang dư, cân nhắc chốt một phần.",
		realized: 65e5,
		settlement: false
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
		spark: makeSpark(26150, .04, .007),
		note: "Lõi chỉ số. Đang thiếu tỷ trọng so với mục tiêu.",
		realized: 0,
		settlement: false
	},
	{
		id: "btc",
		symbol: "BTC",
		name: "Bitcoin",
		class: "crypto",
		sector: "Tài sản số",
		quantity: .055,
		avgCost: 192e7,
		price: 264e7,
		targetWeight: 15,
		spark: makeSpark(264e7, .14, -.018),
		note: "Vị thế vệ tinh. Không để vượt 20% danh mục.",
		realized: 0,
		settlement: false
	},
	{
		id: "cash",
		symbol: "VND",
		name: "Tiền mặt",
		class: "cash",
		sector: "Thanh khoản",
		quantity: 12e7,
		avgCost: 1,
		price: 1,
		targetWeight: 14,
		spark: Array.from({ length: 14 }, () => 1),
		note: "Đệm mua khi thị trường điều chỉnh. Khớp mọi lệnh mua bán.",
		realized: 0,
		settlement: true
	}
];
var TXNS = [
	{
		id: "t1",
		holdingId: "fpt",
		side: "buy",
		quantity: 800,
		price: 98500,
		date: "2025-11-12",
		linked: false
	},
	{
		id: "t2",
		holdingId: "vnm",
		side: "buy",
		quantity: 500,
		price: 71200,
		date: "2026-01-20",
		linked: false
	},
	{
		id: "t3",
		holdingId: "hpg",
		side: "buy",
		quantity: 1800,
		price: 24100,
		date: "2026-02-11",
		linked: false
	},
	{
		id: "t4",
		holdingId: "mwg",
		side: "buy",
		quantity: 350,
		price: 70100,
		date: "2026-03-04",
		linked: false
	},
	{
		id: "t5",
		holdingId: "acb",
		side: "buy",
		quantity: 1400,
		price: 22300,
		date: "2025-12-02",
		linked: false
	},
	{
		id: "t6",
		holdingId: "vcb",
		side: "buy",
		quantity: 280,
		price: 86800,
		date: "2026-01-08",
		linked: false
	},
	{
		id: "t7",
		holdingId: "gold",
		side: "buy",
		quantity: 2.4,
		price: 812e5,
		date: "2025-09-18",
		linked: false
	},
	{
		id: "t8",
		holdingId: "etf",
		side: "buy",
		quantity: 1500,
		price: 23800,
		date: "2026-04-16",
		linked: false
	},
	{
		id: "t9",
		holdingId: "btc",
		side: "buy",
		quantity: .055,
		price: 192e7,
		date: "2026-05-22",
		linked: false
	}
];
function seedHoldings() {
	return BLUEPRINT.map((holding) => ({
		...holding,
		spark: [...holding.spark]
	}));
}
function seedTxns() {
	return TXNS.map((txn) => ({ ...txn }));
}
function blankSpark(price) {
	return makeSpark(price, .01, 0);
}
function cloneHoldings(holdings) {
	return holdings.map((holding) => ({
		...holding,
		spark: [...holding.spark]
	}));
}
function makeSettlement(amount) {
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
		settlement: true
	};
}
function applyTrade(holdings, txns, input) {
	const index = holdings.findIndex((holding) => holding.id === input.holdingId);
	if (index < 0) return {
		ok: false,
		error: "Không tìm thấy vị thế."
	};
	const current = holdings[index];
	if (current.settlement) return {
		ok: false,
		error: "Tiền mặt không mua bán như chứng khoán. Sửa số dư trong hồ sơ."
	};
	if (!(input.quantity > 0) || !(input.price > 0)) return {
		ok: false,
		error: "Số lượng và giá phải lớn hơn 0."
	};
	const qty = roundQty(current, input.quantity);
	if (qty <= 0) return {
		ok: false,
		error: "Số lượng quá nhỏ sau khi làm tròn."
	};
	const value = Math.round(qty * input.price);
	const next = cloneHoldings(holdings);
	let cashIndex = next.findIndex((holding) => holding.settlement);
	if (cashIndex < 0) {
		next.push(makeSettlement(0));
		cashIndex = next.length - 1;
	}
	const target = next[index];
	const cash = next[cashIndex];
	if (input.side === "buy") {
		if (cash.quantity + 1e-6 < value) return {
			ok: false,
			error: `Thiếu ${formatVnd(value - cash.quantity)} tiền mặt.`
		};
		const newQty = target.quantity + qty;
		target.avgCost = target.quantity <= 0 ? input.price : (target.avgCost * target.quantity + input.price * qty) / newQty;
		target.quantity = newQty;
		cash.quantity = Math.round(cash.quantity - value);
	} else {
		if (qty > target.quantity + 1e-8) return {
			ok: false,
			error: "Không đủ số lượng để bán."
		};
		target.realized += (input.price - target.avgCost) * qty;
		target.quantity = Math.max(0, target.quantity - qty);
		cash.quantity = Math.round(cash.quantity + value);
	}
	if (input.price !== target.price) target.spark = [...target.spark.slice(1), input.price];
	target.price = input.price;
	const txn = {
		id: crypto.randomUUID(),
		holdingId: target.id,
		side: input.side,
		quantity: qty,
		price: input.price,
		date: input.date,
		linked: true
	};
	const verb = input.side === "buy" ? "Mua" : "Bán";
	return {
		ok: true,
		holdings: next,
		txns: [txn, ...txns],
		message: `${verb} ${formatQty({
			class: target.class,
			quantity: qty
		})} ${target.symbol}`
	};
}
var usePortfolio = create()(persist((set, get) => ({
	holdings: seedHoldings(),
	txns: seedTxns(),
	touched: false,
	addHolding: (draft) => {
		const isCash = draft.class === "cash";
		const holding = {
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
			settlement: false
		};
		if (isCash || !draft.fundFromCash) {
			const txn = {
				id: crypto.randomUUID(),
				holdingId: holding.id,
				side: "buy",
				quantity: holding.quantity,
				price: holding.price,
				date: todayISO(),
				linked: false
			};
			set({
				holdings: [...get().holdings, holding],
				txns: [txn, ...get().txns],
				touched: true
			});
			return { ok: true };
		}
		const traded = applyTrade([...get().holdings, holding], get().txns, {
			holdingId: holding.id,
			side: "buy",
			quantity: draft.quantity,
			price: draft.price,
			date: todayISO()
		});
		if (!traded.ok) return traded;
		set({
			holdings: traded.holdings,
			txns: traded.txns,
			touched: true
		});
		return { ok: true };
	},
	updateProfile: (id, patch) => {
		set({
			touched: true,
			holdings: get().holdings.map((holding) => {
				if (holding.id !== id) return holding;
				const next = {
					...holding,
					symbol: patch.symbol.trim().toUpperCase(),
					name: patch.name.trim(),
					class: holding.settlement ? "cash" : patch.class,
					sector: patch.sector.trim(),
					note: patch.note,
					targetWeight: patch.targetWeight
				};
				if (holding.settlement && patch.balance !== void 0 && patch.balance >= 0) {
					next.quantity = Math.round(patch.balance);
					next.price = 1;
					next.avgCost = 1;
				}
				return next;
			})
		});
	},
	setPrice: (id, price) => {
		if (!(price > 0)) return;
		set({
			touched: true,
			holdings: get().holdings.map((holding) => {
				if (holding.id !== id || holding.settlement) return holding;
				return {
					...holding,
					price,
					spark: [...holding.spark.slice(1), price]
				};
			})
		});
	},
	removeHolding: (id) => {
		if (!get().holdings.find((holding) => holding.id === id)) return;
		set({
			touched: true,
			holdings: get().holdings.filter((holding) => holding.id !== id),
			txns: get().txns.filter((txn) => txn.holdingId !== id)
		});
	},
	trade: (input) => {
		const result = applyTrade(get().holdings, get().txns, input);
		if (!result.ok) return result;
		set({
			holdings: result.holdings,
			txns: result.txns,
			touched: true
		});
		return {
			ok: true,
			message: result.message
		};
	},
	rebalance: (date) => {
		const plans = rebalancePlans(get().holdings);
		if (plans.length === 0) return {
			ok: false,
			error: "Danh mục đã sát mục tiêu."
		};
		const ordered = [...plans.filter((plan) => plan.side === "sell").sort((a, b) => b.value - a.value), ...plans.filter((plan) => plan.side === "buy").sort((a, b) => a.value - b.value)];
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
				date
			});
			if (!result.ok) {
				skipped += 1;
				continue;
			}
			holdings = result.holdings;
			txns = result.txns;
			done += 1;
		}
		if (done === 0) return {
			ok: false,
			error: "Không đủ tiền mặt để thực hiện các lệnh gợi ý."
		};
		set({
			holdings,
			txns,
			touched: true
		});
		return {
			ok: true,
			done,
			skipped
		};
	},
	reset: () => set({
		holdings: seedHoldings(),
		txns: seedTxns(),
		touched: false
	})
}), {
	name: "aurea-portfolio-v1",
	skipHydration: true,
	partialize: (state) => ({
		holdings: state.holdings,
		txns: state.txns,
		touched: state.touched
	})
}));
var ASSET_CLASSES = [
	"stock",
	"fund",
	"gold",
	"crypto",
	"bond",
	"cash"
];
var schema = object({
	symbol: string().trim().min(1, "Nhập mã").max(12, "Mã tối đa 12 ký tự"),
	name: string().trim().min(1, "Nhập tên"),
	asset: _enum(ASSET_CLASSES),
	sector: string().trim().min(1, "Nhập nhóm"),
	quantity: number().positive("Số lượng phải lớn hơn 0"),
	avgCost: number().positive("Giá vốn phải lớn hơn 0"),
	price: number().positive("Giá phải lớn hơn 0"),
	targetWeight: number().min(0, "Từ 0 đến 100").max(100, "Từ 0 đến 100"),
	note: string().max(280, "Ghi chú tối đa 280 ký tự"),
	fundFromCash: boolean()
});
var empty = {
	symbol: "",
	name: "",
	asset: "stock",
	sector: "",
	quantity: "",
	avgCost: "",
	price: "",
	targetWeight: "5",
	note: "",
	fundFromCash: false
};
function toNumber(raw) {
	const value = Number(raw.replace(",", ".").trim());
	return Number.isFinite(value) ? value : NaN;
}
function CreateDialog({ open, onClose }) {
	const addHolding = usePortfolio((state) => state.addHolding);
	const [form, setForm] = (0, import_react.useState)(empty);
	const [errors, setErrors] = (0, import_react.useState)({});
	const cash = form.asset === "cash";
	(0, import_react.useEffect)(() => {
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
			note: form.note,
			fundFromCash: cash ? false : form.fundFromCash
		});
		if (!parsed.success) {
			const next = {};
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
			fundFromCash: parsed.data.fundFromCash
		});
		if (!result.ok) {
			setErrors({ form: result.error });
			return;
		}
		toast.success(`Đã thêm ${parsed.data.symbol.toUpperCase()}`);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => !next && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "sheet-overlay fixed inset-0 z-40 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "pop-panel fixed top-1/2 left-1/2 z-50 max-h-[min(100dvh-2rem,44rem)] w-[min(100%-2rem,34rem)] overflow-y-auto rounded-card bg-card p-5 shadow-lift outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-3xl text-ink",
					children: "Thêm vị thế"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-muted",
					children: "Ghi một khoản đang nắm, hoặc mua mới bằng tiền mặt."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "soft",
						className: "size-11 px-0",
						"aria-label": "Đóng",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mã",
							error: errors.symbol,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: form.symbol,
								onChange: (event) => setForm({
									...form,
									symbol: event.target.value
								}),
								placeholder: "FPT"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Loại",
							error: errors.asset,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-11 w-full rounded-control border border-line bg-card px-3 text-sm",
								value: form.asset,
								onChange: (event) => setForm({
									...form,
									asset: event.target.value
								}),
								children: ASSET_CLASSES.map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: asset,
									children: classLabel(asset)
								}, asset))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tên",
						error: errors.name,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: form.name,
							onChange: (event) => setForm({
								...form,
								name: event.target.value
							}),
							placeholder: "Tên đầy đủ"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Nhóm",
						error: errors.sector,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: form.sector,
							list: "aurea-sectors",
							onChange: (event) => setForm({
								...form,
								sector: event.target.value
							}),
							placeholder: "Ngân hàng, Công nghệ…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "aurea-sectors",
							children: [
								"Công nghệ",
								"Ngân hàng",
								"Tiêu dùng",
								"Bán lẻ",
								"Công nghiệp",
								"Kim loại quý",
								"Chỉ số",
								"Tài sản số",
								"Thanh khoản"
							].map((sector) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: sector }, sector))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: cash ? "Số dư" : "Số lượng",
							error: errors.quantity,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "decimal",
								value: form.quantity,
								onChange: (event) => setForm({
									...form,
									quantity: event.target.value
								}),
								placeholder: cash ? "50000000" : "100"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mục tiêu %",
							error: errors.targetWeight,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "decimal",
								value: form.targetWeight,
								onChange: (event) => setForm({
									...form,
									targetWeight: event.target.value
								})
							})
						})]
					}),
					cash ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Giá vốn",
							error: errors.avgCost,
							hint: "Giá mỗi đơn vị, không viết dấu chấm nghìn.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "decimal",
								value: form.avgCost,
								onChange: (event) => setForm({
									...form,
									avgCost: event.target.value
								}),
								placeholder: "98500"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Giá hiện tại",
							error: errors.price,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "decimal",
								value: form.price,
								onChange: (event) => setForm({
									...form,
									price: event.target.value
								}),
								placeholder: "142500"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ghi chú",
						error: errors.note,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.note,
							rows: 2,
							onChange: (event) => setForm({
								...form,
								note: event.target.value
							}),
							className: "w-full rounded-control border border-line bg-card px-3 py-2 text-sm outline-none"
						})
					}),
					cash ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-3 rounded-control bg-paper px-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-0.5 size-4 accent-pine",
							checked: form.fundFromCash,
							onChange: (event) => setForm({
								...form,
								fundFromCash: event.target.checked
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-ink",
							children: "Mua bằng tiền mặt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-muted",
							children: "Bỏ chọn nếu bạn chỉ ghi nhận vị thế đang có, không trừ ví."
						})] })]
					}),
					errors.form ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-down",
						children: errors.form
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: submit,
						children: "Thêm vào sổ"
					})
				]
			})]
		})] })
	});
}
function Sparkline({ data, className }) {
	if (data.length < 2) return null;
	const width = 160;
	const height = 48;
	const min = Math.min(...data);
	const span = Math.max(...data) - min || 1;
	const line = data.map((value, index) => {
		return [index / (data.length - 1) * width, height - (value - min) / span * 42 - 3];
	}).map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(" ");
	const area = `${line} L${width},${height} L0,${height} Z`;
	const up = data[data.length - 1] >= data[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${width} ${height}`,
		className: cn("h-full w-full", up ? "text-up" : "text-down", className),
		preserveAspectRatio: "none",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: area,
			className: "fill-current opacity-15"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: line,
			fill: "none",
			className: "stroke-current",
			strokeWidth: "1.75",
			strokeLinejoin: "round",
			strokeLinecap: "round",
			vectorEffect: "non-scaling-stroke"
		})]
	});
}
var toneClass$1 = {
	up: "text-up",
	down: "text-down",
	flat: "text-muted"
};
function HoldingCard({ row, onOpen, delay }) {
	const { h } = row;
	const tone = pnlTone(row.pnl);
	const drift = row.drift;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onOpen(h.id),
		style: { animationDelay: `${delay}ms` },
		className: "card-sheen rise flex w-full flex-col rounded-card bg-card p-4 text-left shadow-card transition-[box-shadow,translate,scale] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.96]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl leading-none tracking-tight text-ink",
						children: h.symbol
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-sm text-ink-soft",
						children: h.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 rounded-full bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-soft",
					children: classLabel(h.class)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-12",
				children: h.class === "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 160 48",
					className: "h-full w-full text-moss",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "24",
						x2: "160",
						y2: "24",
						stroke: "currentColor",
						strokeWidth: "1.75",
						strokeDasharray: "5 6"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { data: h.spark })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl tabular-nums text-ink",
						children: formatVnd(row.value, { compact: true })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 truncate text-xs text-muted",
						children: h.class === "cash" ? "Sẵn sàng khớp lệnh" : `${formatQty(h)} · ${formatVnd(h.price)}`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("text-right text-sm font-semibold tabular-nums", toneClass$1[tone]),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: h.class === "cash" ? "0%" : formatPct(row.pnlPct) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium",
						children: h.class === "cash" ? "—" : formatVnd(row.pnl, {
							signed: true,
							compact: true
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between gap-2 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: h.sector
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 tabular-nums",
						children: [
							formatNum(row.weight),
							"%",
							Math.abs(drift) >= 1.5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("ml-1 font-semibold", drift > 0 ? "text-brass" : "text-pine"),
								children: [
									drift > 0 ? "dư" : "thiếu",
									" ",
									formatNum(Math.abs(drift))
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1",
								children: "· sát mục tiêu"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightBar, {
					actual: row.weight,
					target: row.target
				})]
			})
		]
	});
}
function useMounted() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return mounted;
}
function ValueTip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-control bg-ink px-3 py-2 text-xs text-foam shadow-lift",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-foam-dim",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 font-semibold tabular-nums",
			children: formatVnd(Number(payload[0]?.value ?? 0), { compact: true })
		})]
	});
}
function PortfolioChart({ points }) {
	if (!useMounted()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-card bg-paper-2/60" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: points,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						},
						axisLine: false,
						tickLine: false,
						interval: 2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						},
						axisLine: false,
						tickLine: false,
						width: 56,
						tickFormatter: (value) => {
							const abs = Math.abs(value);
							if (abs >= 1e9) return `${(abs / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`;
							if (abs >= 1e6) return `${Math.round(abs / 1e6)} tr`;
							return formatVnd(value, { compact: true });
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueTip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "value",
						stroke: "var(--color-pine)",
						fill: "var(--color-pine)",
						fillOpacity: .14,
						strokeWidth: 2
					})
				]
			})
		})
	});
}
var SLICE_COLORS = [
	"var(--color-pine)",
	"var(--color-brass)",
	"var(--color-moss)",
	"var(--color-ink-soft)",
	"var(--color-pine-2)",
	"var(--color-muted)"
];
function AllocationDonut({ slices }) {
	if (!useMounted()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-64 w-full max-w-xs rounded-full bg-paper-2/60" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data: slices,
				dataKey: "value",
				nameKey: "name",
				innerRadius: 68,
				outerRadius: 96,
				paddingAngle: 2,
				stroke: "none",
				children: slices.map((slice, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: SLICE_COLORS[index % SLICE_COLORS.length] }, slice.name))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueTip, {}) })] })
		})
	});
}
function PriceChart({ holding }) {
	const mounted = useMounted();
	const labels = sessionLabels(holding.spark.length);
	const data = holding.spark.map((price, index) => ({
		label: labels[index],
		value: price
	}));
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 rounded-card bg-paper-2/60" });
	const color = holding.spark[holding.spark.length - 1] >= holding.spark[0] ? "var(--color-up)" : "var(--color-down)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					top: 8,
					right: 4,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tick: {
							fill: "var(--color-muted)",
							fontSize: 11
						},
						axisLine: false,
						tickLine: false,
						interval: 3
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueTip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "value",
						stroke: color,
						fill: color,
						fillOpacity: .12,
						strokeWidth: 2
					})
				]
			})
		})
	});
}
var toneClass = {
	up: "text-up",
	down: "text-down",
	flat: "text-muted"
};
function HoldingSheet({ row, txns, open, onClose }) {
	const trade = usePortfolio((state) => state.trade);
	const setPrice = usePortfolio((state) => state.setPrice);
	const updateProfile = usePortfolio((state) => state.updateProfile);
	const removeHolding = usePortfolio((state) => state.removeHolding);
	const [last, setLast] = (0, import_react.useState)(row);
	const [side, setSide] = (0, import_react.useState)("buy");
	const [qty, setQty] = (0, import_react.useState)("");
	const [price, setPriceInput] = (0, import_react.useState)("");
	const [mark, setMark] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [error, setError] = (0, import_react.useState)("");
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [profile, setProfile] = (0, import_react.useState)({
		symbol: "",
		name: "",
		asset: "stock",
		sector: "",
		note: "",
		balance: ""
	});
	(0, import_react.useEffect)(() => {
		if (row) setLast(row);
	}, [row]);
	const shown = row ?? last;
	(0, import_react.useEffect)(() => {
		if (!shown) return;
		setSide("buy");
		setQty("");
		setPriceInput(String(shown.h.price));
		setMark(String(shown.h.price));
		setDate(todayISO());
		setError("");
		setConfirmDelete(false);
		setProfile({
			symbol: shown.h.symbol,
			name: shown.h.name,
			asset: shown.h.class,
			sector: shown.h.sector,
			note: shown.h.note,
			balance: String(shown.h.quantity)
		});
	}, [shown?.h.id]);
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
			date
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
		toast.success(`Giá ${holding.symbol} cập nhật ${formatVnd(next)}`);
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
			balance: holding.settlement ? balance : void 0
		});
		toast.success("Đã lưu hồ sơ.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => !next && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "sheet-overlay fixed inset-0 z-40 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sheet-panel fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-lift outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 border-b border-line px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-3xl leading-none tracking-tight text-ink",
						children: holding.symbol
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "mt-1 truncate text-sm text-ink-soft",
						children: holding.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "soft",
						className: "size-11 shrink-0 px-0",
						"aria-label": "Đóng",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-5 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-wide text-muted uppercase",
							children: "Giá trị"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl tabular-nums text-ink",
							children: formatVnd(shown.value, { compact: true })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("text-right text-sm font-semibold tabular-nums", toneClass[tone]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: holding.class === "cash" ? "Không lãi lỗ" : formatPct(shown.pnlPct) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: holding.class === "cash" ? formatVnd(shown.value) : formatVnd(shown.pnl, {
								signed: true,
								compact: true
							}) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Tỷ trọng",
								value: `${formatNum(shown.weight)}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Mục tiêu",
								value: `${formatNum(shown.target)}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Số lượng",
								value: formatQty(holding)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Giá vốn",
								value: holding.class === "cash" ? "—" : formatVnd(holding.avgCost)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Đã chốt",
								value: formatVnd(holding.realized, {
									signed: true,
									compact: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Phiên gần nhất",
								value: formatVnd(shown.day, {
									signed: true,
									compact: true
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center justify-between text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mục tiêu tỷ trọng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 tabular-nums font-semibold text-ink",
									children: [formatNum(holding.targetWeight, 0), "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 100,
								step: 1,
								value: holding.targetWeight,
								"aria-label": "Mục tiêu tỷ trọng",
								className: "w-full",
								onChange: (event) => updateProfile(holding.id, {
									symbol: holding.symbol,
									name: holding.name,
									class: holding.class,
									sector: holding.sector,
									note: holding.note,
									targetWeight: Number(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Vạch đồng trên thẻ là mục tiêu. Aurea chuẩn hóa để tổng mục tiêu thành 100%."
							})
						]
					}),
					holding.class !== "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, { holding })
					}) : null,
					holding.class !== "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl text-ink",
								children: "Ghi lệnh"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: ["buy", "sell"].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSide(option),
									className: cn("h-11 rounded-control text-sm font-semibold transition-colors", side === option ? "bg-pine text-foam" : "bg-paper-2 text-ink-soft"),
									children: option === "buy" ? "Mua" : "Bán"
								}, option))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Số lượng",
										hint: holding.class === "stock" || holding.class === "fund" ? "Làm tròn xuống số nguyên." : void 0,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
											inputMode: "decimal",
											value: qty,
											onChange: (event) => setQty(event.target.value),
											placeholder: "0"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Giá",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
												inputMode: "decimal",
												value: price,
												onChange: (event) => setPriceInput(event.target.value)
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Ngày",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
												type: "date",
												value: date,
												onChange: (event) => setDate(event.target.value)
											})
										})]
									}),
									error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-down",
										children: error
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "flex-1",
											onClick: submitTrade,
											children: "Ghi sổ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "soft",
											onClick: () => setQty(String(holding.quantity)),
											children: "Bán hết"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Lệnh mua trừ tiền mặt, lệnh bán cộng tiền mặt. Không gửi ra sàn."
									})
								]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl text-ink",
							children: "Cập nhật giá"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "decimal",
								value: mark,
								onChange: (event) => setMark(event.target.value),
								disabled: holding.settlement
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "soft",
								onClick: commitPrice,
								disabled: holding.settlement,
								children: "Lưu giá"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl text-ink",
							children: "Sổ lệnh"
						}), history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Chưa có lệnh."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-line",
							children: history.map((txn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-baseline justify-between gap-3 py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-ink",
										children: txn.side === "buy" ? "Mua" : "Bán"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [" · ", formatDate(txn.date)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: txn.linked ? "Đã khớp tiền mặt" : "Ghi nhận số dư"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right tabular-nums",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatQty({
										class: holding.class,
										quantity: txn.quantity
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: formatVnd(txn.price)
									})]
								})]
							}, txn.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-6 border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "flex h-11 cursor-pointer items-center justify-between text-sm font-semibold",
							children: ["Hồ sơ vị thế", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted",
								children: classLabel(holding.class)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Mã",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: profile.symbol,
										onChange: (event) => setProfile({
											...profile,
											symbol: event.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Tên",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: profile.name,
										onChange: (event) => setProfile({
											...profile,
											name: event.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Loại",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "h-11 w-full rounded-control border border-line bg-card px-3 text-sm",
											value: profile.asset,
											disabled: holding.settlement,
											onChange: (event) => setProfile({
												...profile,
												asset: event.target.value
											}),
											children: ASSET_CLASSES.map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: asset,
												children: classLabel(asset)
											}, asset))
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Nhóm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
											value: profile.sector,
											onChange: (event) => setProfile({
												...profile,
												sector: event.target.value
											})
										})
									})]
								}),
								holding.settlement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Số dư tiền mặt",
									hint: "Nạp hoặc rút bằng cách sửa số này.",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										inputMode: "decimal",
										value: profile.balance,
										onChange: (event) => setProfile({
											...profile,
											balance: event.target.value
										})
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Số lượng và giá vốn chỉ đổi qua lệnh mua hoặc bán."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Ghi chú",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: profile.note,
										onChange: (event) => setProfile({
											...profile,
											note: event.target.value
										}),
										rows: 3,
										className: "w-full rounded-control border border-line bg-card px-3 py-2 text-sm text-ink outline-none"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "soft",
									onClick: saveProfile,
									children: "Lưu hồ sơ"
								})
							]
						})]
					}),
					holding.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-control bg-brass-soft px-3 py-3 text-sm leading-relaxed text-ink",
						children: holding.note
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 border-t border-line pt-4",
						children: [confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								className: "flex-1",
								onClick: () => {
									removeHolding(holding.id);
									toast("Đã xóa khỏi sổ.");
									onClose();
								},
								children: "Xóa hẳn"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "soft",
								onClick: () => setConfirmDelete(false),
								children: "Giữ lại"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "text-down",
							onClick: () => setConfirmDelete(true),
							children: "Xóa vị thế khỏi sổ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted",
							children: "Xóa không cộng số dư vào tiền mặt. Muốn chốt, hãy bán trước."
						})]
					})
				]
			})]
		})] })
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-control bg-paper px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-0.5 font-semibold tabular-nums text-ink",
			children: value
		})]
	});
}
var toneText$1 = {
	up: "text-up",
	down: "text-down",
	flat: "text-muted"
};
function OverviewPanel({ rows, holdings }) {
	const points = historyOf(holdings);
	const movers = [...rows].filter((row) => row.h.class !== "cash").sort((a, b) => b.day - a.day);
	const best = movers[0];
	const worst = movers[movers.length - 1];
	const realized = holdings.reduce((sum, holding) => sum + holding.realized, 0);
	const unrealized = rows.reduce((sum, row) => sum + row.pnl, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-card bg-card p-4 shadow-card sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "14 phiên gần nhất"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Giữ nguyên số lượng hiện tại"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortfolioChart, { points })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mover, {
					title: "Kéo danh mục lên",
					row: best
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mover, {
					title: "Kéo danh mục xuống",
					row: worst
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-card bg-card p-4 shadow-card sm:grid-cols-3 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Lãi chưa chốt",
						value: formatVnd(unrealized, {
							signed: true,
							compact: true
						}),
						tone: pnlTone(unrealized)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Lãi đã chốt",
						value: formatVnd(realized, {
							signed: true,
							compact: true
						}),
						tone: pnlTone(realized)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Số vị thế",
						value: String(rows.filter((row) => row.h.class !== "cash" && row.h.quantity > 0).length),
						tone: "flat"
					})
				]
			})
		]
	});
}
function Mover({ title, row }) {
	if (!row) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-card bg-card p-4 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-muted uppercase",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-display text-2xl text-ink",
				children: row.h.symbol
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: row.h.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("mt-3 font-semibold tabular-nums", toneText$1[pnlTone(row.day)]),
				children: [formatVnd(row.day, {
					signed: true,
					compact: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-sm",
					children: formatPct((row.h.spark.at(-2) ? (row.h.price - row.h.spark.at(-2)) / row.h.spark.at(-2) : 0) * 100)
				})]
			})
		]
	});
}
function Mini({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("mt-1 font-display text-2xl tabular-nums", tone === "flat" ? "text-ink" : toneText$1[tone]),
		children: value
	})] });
}
function AllocationPanel({ rows }) {
	const total = totalValue(rows);
	const byClass = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const name = classLabel(row.h.class);
		const current = byClass.get(name) ?? {
			name,
			value: 0
		};
		current.value += row.value;
		byClass.set(name, current);
	}
	const slices = [...byClass.values()].filter((slice) => slice.value > 0).sort((a, b) => b.value - a.value);
	const sectors = /* @__PURE__ */ new Map();
	for (const row of rows) sectors.set(row.h.sector, (sectors.get(row.h.sector) ?? 0) + row.value);
	const sectorRows = [...sectors.entries()].sort((a, b) => b[1] - a[1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[0.9fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-card bg-card p-4 shadow-card sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink",
					children: "Theo loại tài sản"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllocationDonut, { slices }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Tổng"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl tabular-nums text-ink",
							children: formatVnd(total, { compact: true })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: slices.map((slice, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-2.5 rounded-full",
								style: { background: SLICE_COLORS[index % SLICE_COLORS.length] }
							}), slice.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-ink-soft",
							children: [
								formatNum(total ? slice.value / total * 100 : 0),
								"% · ",
								formatVnd(slice.value, { compact: true })
							]
						})]
					}, slice.name))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-card bg-card p-4 shadow-card sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: "Theo nhóm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-4",
				children: sectorRows.map(([sector, value]) => {
					const pct = total ? value / total * 100 : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex items-baseline justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-ink",
							children: sector
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted",
							children: [
								formatNum(pct),
								"% · ",
								formatVnd(value, { compact: true })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 rounded-full bg-paper-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-pine",
							style: { width: `${Math.max(2, Math.min(100, pct))}%` }
						})
					})] }, sector);
				})
			})]
		})]
	});
}
var SHOCKS = [
	{
		id: "equities",
		label: "Cổ phiếu & quỹ −10%",
		detail: "Vàng, crypto và tiền mặt đứng yên."
	},
	{
		id: "gold",
		label: "Vàng −5%",
		detail: "Chỉ miếng vàng và tài sản loại vàng."
	},
	{
		id: "crypto",
		label: "Crypto −25%",
		detail: "Nhịp giảm mạnh của tài sản số."
	},
	{
		id: "banks",
		label: "Ngân hàng −8%",
		detail: "Các mã thuộc nhóm Ngân hàng."
	}
];
function InsightsPanel({ rows, onOpen }) {
	const holdings = usePortfolio((state) => state.holdings);
	const rebalance = usePortfolio((state) => state.rebalance);
	const health = healthOf(rows);
	const insights = buildInsights(rows);
	const plans = rebalancePlans(holdings);
	const total = totalValue(rows);
	const [shock, setShock] = (0, import_react.useState)(null);
	const shocked = shock ? shockedValue(rows, shock) : total;
	const sells = plans.filter((plan) => plan.side === "sell").reduce((sum, plan) => sum + plan.value, 0);
	const buys = plans.filter((plan) => plan.side === "buy").reduce((sum, plan) => sum + plan.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-card bg-card p-4 shadow-card sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end justify-between gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-wide text-brass uppercase",
						children: "Sức khỏe danh mục"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-1 font-display text-3xl text-ink",
						children: [
							health.score,
							" · ",
							health.label
						]
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 grid gap-4 sm:grid-cols-2",
					children: health.factors.map((factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1.5 flex items-baseline justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-ink",
								children: factor.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: factor.score
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 rounded-full bg-paper-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-pine",
								style: { width: `${factor.score}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs leading-relaxed text-muted",
							children: factor.detail
						})
					] }, factor.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: insights.map((insight) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card bg-card p-4 shadow-card sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("text-xs font-semibold tracking-wide uppercase", insight.tone === "warn" ? "text-brass" : insight.tone === "good" ? "text-up" : "text-muted"),
							children: insight.tone === "warn" ? "Cần để mắt" : insight.tone === "good" ? "Đang ổn" : "Quan sát"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-2xl text-ink",
							children: insight.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-ink-soft",
							children: insight.body
						}),
						insight.holdingId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 inline-flex h-11 items-center text-sm font-semibold text-pine",
							onClick: () => onOpen(insight.holdingId),
							children: "Mở thẻ"
						}) : null
					]
				}, insight.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-card bg-card p-4 shadow-card sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "Phiếu tái cân bằng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Đưa từng vị thế về mục tiêu bạn đã kéo trên thẻ. Bán trước, mua sau, tiền mặt là ví khớp."
					}),
					plans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Không có lệnh nào đáng kể. Danh mục đang sát mục tiêu."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 divide-y divide-line",
							children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("font-semibold", plan.side === "buy" ? "text-up" : "text-down"),
										children: plan.side === "buy" ? "Mua" : "Bán"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-ink",
										children: [" ", plan.symbol]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: formatQty({
											class: plan.class,
											quantity: plan.quantity
										})
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-ink-soft",
									children: formatVnd(plan.value, { compact: true })
								})]
							}, `${plan.side}-${plan.holdingId}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted",
							children: [
								"Bán thu ",
								formatVnd(sells, { compact: true }),
								" · Mua cần ",
								formatVnd(buys, { compact: true }),
								". Lệnh mua thiếu tiền sẽ bị bỏ qua."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: () => {
								const result = rebalance(todayISO());
								if (!result.ok) {
									toast.error(result.error);
									return;
								}
								toast.success(result.skipped > 0 ? `Đã ghi ${result.done} lệnh, bỏ ${result.skipped} vì thiếu tiền.` : `Đã ghi ${result.done} lệnh vào sổ.`);
							},
							children: "Mô phỏng vào sổ"
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-card bg-pine p-4 text-foam shadow-lift sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Thử sức chịu đựng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-foam-dim",
						children: "Không đổi sổ. Chỉ xem danh mục còn bao nhiêu nếu một cú sốc xảy ra hôm nay."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2 sm:grid-cols-2",
						children: SHOCKS.map((item) => {
							const active = shock === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShock(active ? null : item.id),
								className: cn("h-auto min-h-11 rounded-control px-3 py-2 text-left text-sm transition-colors active:scale-[0.96]", active ? "bg-foam text-ink" : "bg-pine-2 text-foam"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("mt-0.5 block text-xs", active ? "text-muted" : "text-foam-dim"),
									children: item.detail
								})]
							}, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 font-display text-3xl tabular-nums",
						children: [formatVnd(shocked, { compact: true }), shock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("ml-3 text-lg", shocked - total < 0 ? "text-rose" : "text-mint"),
							children: formatVnd(shocked - total, {
								signed: true,
								compact: true
							})
						}) : null]
					})
				]
			})
		]
	});
}
var TABS = [
	{
		id: "cards",
		label: "Thẻ"
	},
	{
		id: "overview",
		label: "Toàn cảnh"
	},
	{
		id: "mix",
		label: "Phân bổ"
	},
	{
		id: "insights",
		label: "Gợi ý"
	}
];
var toneText = {
	up: "text-mint",
	down: "text-rose",
	flat: "text-foam-dim"
};
function AureaApp() {
	const holdings = usePortfolio((state) => state.holdings);
	const txns = usePortfolio((state) => state.txns);
	const touched = usePortfolio((state) => state.touched);
	const reset = usePortfolio((state) => state.reset);
	const [tab, setTab] = (0, import_react.useState)("cards");
	const [query, setQuery] = (0, import_react.useState)("");
	const [asset, setAsset] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("value");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [armReset, setArmReset] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		usePortfolio.persist.rehydrate();
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
			if (event.key === "/" && !typing) {
				event.preventDefault();
				document.getElementById("aurea-search")?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const rows = (0, import_react.useMemo)(() => rowsOf(holdings), [holdings]);
	const health = (0, import_react.useMemo)(() => healthOf(rows), [rows]);
	const total = totalValue(rows);
	const day = rows.reduce((sum, row) => sum + row.day, 0);
	const dayBase = total - day;
	const dayPct = dayBase !== 0 ? day / dayBase * 100 : 0;
	const shownTotal = useCountUp(total);
	const cash = rows.find((row) => row.h.settlement);
	const openRow = rows.find((row) => row.h.id === openId) ?? null;
	const visible = (0, import_react.useMemo)(() => {
		const needle = fold(query.trim());
		const ranked = [...rows.filter((row) => {
			if (asset !== "all" && row.h.class !== asset) return false;
			if (!needle) return true;
			return fold(`${row.h.symbol} ${row.h.name} ${row.h.sector}`).includes(needle);
		})];
		ranked.sort((a, b) => compareRows(a, b, sort));
		return ranked;
	}, [
		rows,
		query,
		asset,
		sort
	]);
	const classes = ASSET_CLASSES.filter((item) => rows.some((row) => row.h.class === item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "bottom-center",
				toastOptions: { style: {
					background: "var(--color-ink)",
					color: "var(--color-foam)",
					border: "none",
					fontFamily: "var(--font-sans)"
				} }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-full bg-pine",
							"aria-hidden": true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-brass-bright" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-none tracking-wide text-ink",
							children: "Aurea"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Sổ đầu tư thông minh"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "pr-3.5 pl-4",
						onClick: () => setCreating(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Thêm"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-6xl px-4 pb-3 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "tablist",
						"aria-label": "Mục sổ",
						className: "no-scrollbar flex gap-1 overflow-x-auto",
						children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": tab === item.id,
							onClick: () => setTab(item.id),
							className: cn("h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors", tab === item.id ? "bg-pine text-foam" : "text-ink-soft hover:bg-paper-2"),
							children: item.label
						}, item.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rise rounded-card bg-pine p-4 text-foam shadow-lift sm:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-wide text-foam-dim uppercase",
										children: "Tổng giá trị"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-display text-4xl tabular-nums sm:text-5xl",
										children: formatVnd(shownTotal, { compact: true })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: cn("mt-2 text-sm font-semibold tabular-nums", toneText[pnlTone(day)]),
										children: [
											"Phiên gần nhất ",
											formatVnd(day, {
												signed: true,
												compact: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-2 font-medium",
												children: formatPct(dayPct)
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthRing, {
								score: health.score,
								label: health.label,
								onDark: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 grid grid-cols-2 gap-3 border-t border-foam/15 pt-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroStat, {
									label: "Tiền mặt",
									value: formatVnd(cash?.value ?? 0, { compact: true })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroStat, {
									label: "Lãi chưa chốt",
									value: formatVnd(rows.reduce((sum, row) => sum + row.pnl, 0), {
										signed: true,
										compact: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroStat, {
									label: "Vị thế lệch",
									value: String(rows.filter((row) => Math.abs(row.drift) >= 2).length)
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						role: "tabpanel",
						children: [
							tab === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardsView, {
								rows: visible,
								classes,
								asset,
								sort,
								query,
								onQuery: setQuery,
								onAsset: setAsset,
								onSort: setSort,
								onOpen: (id) => {
									setOpenId(id);
								}
							}) : null,
							tab === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewPanel, {
								rows,
								holdings
							}) : null,
							tab === "mix" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllocationPanel, { rows }) : null,
							tab === "insights" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightsPanel, {
								rows,
								onOpen: setOpenId
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "mt-10 flex flex-col gap-3 border-t border-line pt-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "max-w-xl leading-relaxed",
							children: [touched ? "Đã lưu trên trình duyệt này." : "Đang xem dữ liệu mẫu — sửa thoải mái, số sẽ được giữ lại trên máy bạn.", " Aurea không phải lời khuyên đầu tư."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 shrink-0 text-left font-semibold text-ink",
							onClick: () => {
								if (!armReset) {
									setArmReset(true);
									return;
								}
								reset();
								setArmReset(false);
								setOpenId(null);
							},
							children: armReset ? "Xác nhận khôi phục mẫu" : "Khôi phục dữ liệu mẫu"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldingSheet, {
				row: openRow,
				txns,
				open: openRow !== null,
				onClose: () => setOpenId(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateDialog, {
				open: creating,
				onClose: () => setCreating(false)
			})
		]
	});
}
function HeroStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-foam-dim",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5 font-semibold tabular-nums",
		children: value
	})] });
}
function CardsView({ rows, classes, asset, sort, query, onQuery, onAsset, onSort, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "aurea-search",
						value: query,
						onChange: (event) => onQuery(event.target.value),
						placeholder: "Tìm mã, tên, nhóm",
						"aria-label": "Tìm vị thế",
						className: "h-11 w-full rounded-control border border-line bg-card pr-3 pl-10 text-sm outline-none placeholder:text-muted"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "sr-only",
					htmlFor: "aurea-sort",
					children: "Sắp xếp"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "aurea-sort",
					value: sort,
					onChange: (event) => onSort(event.target.value),
					className: "h-11 rounded-control border border-line bg-card px-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "value",
							children: "Giá trị"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "gain",
							children: "Lãi cao"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "loss",
							children: "Lỗ nhiều"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "drift",
							children: "Lệch mục tiêu"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "name",
							children: "Tên"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: asset === "all",
				onClick: () => onAsset("all"),
				children: "Tất cả"
			}), classes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: asset === item,
				onClick: () => onAsset(item),
				children: classLabel(item)
			}, item))]
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-card border border-dashed border-line px-4 py-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-ink",
				children: "Không có thẻ nào"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Đổi bộ lọc, hoặc thêm một vị thế mới."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: rows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldingCard, {
				row,
				delay: Math.min(index, 8) * 45,
				onOpen
			}, row.h.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-xs text-muted",
			children: [
				"Vạch đồng trên mỗi thẻ là mục tiêu. ",
				rows.length,
				" thẻ · nhấn ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-ink-soft",
					children: "/"
				}),
				" để tìm."
			]
		})
	] });
}
function Chip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors", active ? "bg-ink text-foam" : "bg-card text-ink-soft shadow-card"),
		children
	});
}
function compareRows(a, b, sort) {
	if (sort === "value") return b.value - a.value;
	if (sort === "gain") return b.pnlPct - a.pnlPct;
	if (sort === "loss") return a.pnlPct - b.pnlPct;
	if (sort === "drift") return Math.abs(b.drift) - Math.abs(a.drift);
	return a.h.name.localeCompare(b.h.name, "vi");
}
var SplitComponent = AureaApp;
//#endregion
export { SplitComponent as component };
