import { formatVnd, sessionLabels } from "@/lib/portfolio/format";
import type { Holding } from "@/lib/portfolio/types";
import { useEffect, useState } from "react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function ValueTip({ active, payload, label }: { active?: boolean; payload?: { value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-control bg-ink px-3 py-2 text-xs text-foam shadow-lift">
      <div className="text-foam-dim">{label}</div>
      <div className="mt-0.5 font-semibold tabular-nums">{formatVnd(Number(payload[0]?.value ?? 0), { compact: true })}</div>
    </div>
  );
}

export function PortfolioChart({ points }: { points: { label: string; value: number }[] }) {
  const mounted = useMounted();
  if (!mounted) return <div className="h-64 rounded-card bg-paper-2/60" />;
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} interval={2} />
          <YAxis
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(value: number) => {
                const abs = Math.abs(value);
                if (abs >= 1_000_000_000) return `${(abs / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`;
                if (abs >= 1_000_000) return `${Math.round(abs / 1_000_000)} tr`;
                return formatVnd(value, { compact: true });
              }}
          />
          <Tooltip content={<ValueTip />} />
          <Area type="monotone" dataKey="value" stroke="var(--color-pine)" fill="var(--color-pine)" fillOpacity={0.14} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export const SLICE_COLORS = [
  "var(--color-pine)",
  "var(--color-brass)",
  "var(--color-moss)",
  "var(--color-ink-soft)",
  "var(--color-pine-2)",
  "var(--color-muted)",
];

export function AllocationDonut({ slices }: { slices: { name: string; value: number }[] }) {
  const mounted = useMounted();
  if (!mounted) return <div className="mx-auto h-64 w-full max-w-xs rounded-full bg-paper-2/60" />;
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={slices} dataKey="value" nameKey="name" innerRadius={68} outerRadius={96} paddingAngle={2} stroke="none">
            {slices.map((slice, index) => (
              <Cell key={slice.name} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ValueTip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriceChart({ holding }: { holding: Holding }) {
  const mounted = useMounted();
  const labels = sessionLabels(holding.spark.length);
  const data = holding.spark.map((price, index) => ({ label: labels[index], value: price }));
  if (!mounted) return <div className="h-40 rounded-card bg-paper-2/60" />;
  const up = holding.spark[holding.spark.length - 1]! >= holding.spark[0]!;
  const color = up ? "var(--color-up)" : "var(--color-down)";
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
          <Tooltip content={<ValueTip />} />
          <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.12} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
