import { CheckCircle2, Package } from "lucide-react";

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

const TONES = {
  green: "bg-forest-50 text-forest-600",
  amber: "bg-harvest-100 text-harvest-600",
  blue: "bg-sky-50 text-sky-600",
  purple: "bg-violet-50 text-violet-600",
  rose: "bg-clay-100 text-clay-600",
};

export function Stat({ icon: Icon, label, value, tone = "green" }) {
  return (
    <div className="card flex items-center gap-3.5 !p-4">
      <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl ${TONES[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <span className="block text-xs text-forest-500/80">{label}</span>
        <strong className="block text-2xl font-display font-semibold text-ink">{value}</strong>
      </div>
    </div>
  );
}

export function Loading({ text = "Loading…" }) {
  return (
    <div className="grid place-items-center gap-3 py-16 text-forest-500">
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-forest-100 border-t-forest-500" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="grid min-h-screen place-items-center gap-3 text-forest-500">
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-forest-100 border-t-forest-500" />
      Loading…
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div className="mb-4 rounded-xl border border-clay-300/50 bg-clay-100/60 px-4 py-3 text-sm font-medium text-clay-600">
      {message || "Something went wrong"}
    </div>
  );
}

export function SuccessBox({ message }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm font-medium text-forest-700">
      <CheckCircle2 size={17} />
      {message}
    </div>
  );
}

export function Empty({ text }) {
  return (
    <div className="grid place-items-center gap-2 py-16 text-center text-forest-500/80">
      <Package size={32} />
      <p className="text-sm">{text}</p>
    </div>
  );
}

const STATUS_STYLES = {
  available: "bg-forest-50 text-forest-600",
  claimed: "bg-harvest-100 text-harvest-600",
  picked_up: "bg-violet-50 text-violet-600",
  delivered: "bg-sky-50 text-sky-600",
  expired: "bg-clay-100 text-clay-600",
};

export function Status({ value }) {
  const key = String(value || "").toLowerCase();
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[key] || "bg-forest-50 text-forest-600"}`}>
      {value}
    </span>
  );
}

// The "ripeness ring" — a conic-gradient gauge standing in for the priority
// badge. Fill and color read as an at-a-glance urgency signal, echoing the
// domain: how much time is left before food goes to waste.
const RIPENESS = {
  HIGH: { fill: "92%", color: "#C1592F", label: "HIGH" },
  MEDIUM: { fill: "58%", color: "#C58B22", label: "MEDIUM" },
  LOW: { fill: "28%", color: "#1F7A46", label: "LOW" },
};

export function Priority({ value, showLabel = true }) {
  if (!value) return <span className="text-xs text-forest-400">Not assigned</span>;
  const r = RIPENESS[String(value).toUpperCase()] || RIPENESS.LOW;
  return (
    <div className="flex items-center gap-2">
      <div className="ripeness-ring" style={{ "--fill": r.fill, "--ring-color": r.color }} />
      {showLabel && (
        <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: r.color }}>
          {r.label}
        </span>
      )}
    </div>
  );
}

export function Page({ title, subtitle, action, children }) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Operations</span>
          <h2 className="mt-1 font-display text-3xl font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-1 text-forest-500/90">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </>
  );
}
