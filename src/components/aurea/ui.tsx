import { cn } from "@/lib/cn";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "soft" | "danger" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" && "bg-pine text-foam hover:bg-pine-2",
        variant === "ghost" && "bg-transparent text-ink hover:bg-paper-2",
        variant === "soft" && "bg-paper-2 text-ink hover:bg-line",
        variant === "danger" && "bg-down-soft text-down hover:bg-down hover:text-foam",
        className,
      )}
      {...props}
    />
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="next"
      className={cn(
        "h-11 w-full rounded-control border border-line bg-card px-3 text-sm text-ink outline-none placeholder:text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-muted uppercase">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-down">{error}</span> : null}
      {!error && hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function PickerSheet({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  return (
    <>
      <button type="button" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} className="flex h-11 w-full items-center justify-between gap-3 rounded-control border border-line bg-card px-3 text-left text-sm text-ink disabled:pointer-events-none disabled:opacity-50">
        <span className="truncate">{selected?.label ?? "Chọn"}</span><span className="text-xs text-muted">⌄</span>
      </button>
      {open ? <div className="native-overlay fixed inset-0 z-[70] flex items-end bg-ink/40 p-3 sm:items-center sm:justify-center" onClick={() => setOpen(false)}>
        <div role="dialog" aria-label={label} className="native-sheet w-full max-w-md rounded-card bg-card p-4 shadow-lift" onClick={(event) => event.stopPropagation()}>
          <div className="mb-3 flex items-center justify-between"><h3 className="font-display text-2xl text-ink">{label}</h3><button type="button" aria-label="Đóng" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-control bg-paper-2 text-ink">×</button></div>
          <div className="grid gap-1">{options.map((option) => <button key={option.value} type="button" onClick={() => { onChange(option.value); setOpen(false); }} className={cn("flex min-h-11 items-center justify-between rounded-control px-3 text-left text-sm font-semibold", option.value === value ? "bg-pine text-foam" : "text-ink-soft hover:bg-paper-2")}><span>{option.label}</span><span aria-hidden>{option.value === value ? "✓" : ""}</span></button>)}</div>
        </div>
      </div> : null}
    </>
  );
}

export function HealthRing({ score, label, onDark = false }: { score: number; label: string; onDark?: boolean }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className="relative grid size-24 shrink-0 place-items-center" aria-label={`Điểm sức khỏe ${score}, ${label}`}>
      <svg viewBox="0 0 88 88" className="size-24 -rotate-90">
        <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="7" className={onDark ? "stroke-foam/15" : "stroke-paper-2"} />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={onDark ? "stroke-brass-bright" : "stroke-pine"}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.2, 0, 0, 1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={cn("font-display text-2xl leading-none tabular-nums", onDark ? "text-foam" : "text-ink")}>{score}</div>
        <div className={cn("text-xs", onDark ? "text-foam-dim" : "text-muted")}>{label}</div>
      </div>
    </div>
  );
}

export function useCountUp(value: number): number {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
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
    const tick = (now: number) => {
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

export function WeightBar({ actual, target }: { actual: number; target: number }) {
  return (
    <div className="relative h-3" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-paper-2">
        <div
          className="h-full rounded-full bg-pine"
          style={{ width: `${Math.max(2, Math.min(100, actual))}%`, transition: "width 300ms ease-out" }}
        />
      </div>
      <span
        className="absolute top-0 h-3 w-0.5 -translate-x-1/2 rounded-full bg-brass"
        style={{ left: `${Math.max(0, Math.min(100, target))}%` }}
      />
    </div>
  );
}
