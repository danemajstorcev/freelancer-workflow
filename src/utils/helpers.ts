export const uid = (): string =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const today = (): string => new Date().toISOString().slice(0, 10);

export const formatDate = (iso: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const initials = (name: string): string =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const AVATAR_COLORS = [
  "#6366f4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
];
