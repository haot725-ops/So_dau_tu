import { cn } from "@/lib/cn";

export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const width = 160;
  const height = 48;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / span) * (height - 6) - 3;
    return [x, y] as const;
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const up = data[data.length - 1]! >= data[0]!;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("h-full w-full", up ? "text-up" : "text-down", className)} preserveAspectRatio="none" aria-hidden>
      <path d={area} className="fill-current opacity-15" />
      <path d={line} fill="none" className="stroke-current" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
