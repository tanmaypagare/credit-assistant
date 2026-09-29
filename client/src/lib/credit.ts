export type HealthStatus = "Poor" | "Fair" | "Good" | "Excellent";

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatPercent(value: number | string) {
  return `${(Number(value) * 100).toFixed(1)}%`;
}

export function statusTone(status: string) {
  switch (status) {
    case "Excellent": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Good": return "bg-sky-100 text-sky-700 border-sky-200";
    case "Fair": return "bg-amber-100 text-amber-700 border-amber-200";
    default: return "bg-rose-100 text-rose-700 border-rose-200";
  }
}

export function initials(name?: string | null) {
  return (name || "Member")
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
