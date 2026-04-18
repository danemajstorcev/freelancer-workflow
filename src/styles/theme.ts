export const lightTheme = {
  name: "light" as const,

  bg: "#f7f8fc",
  bgCard: "#ffffff",
  bgSidebar: "#ffffff",
  bgHover: "#f1f3f9",
  bgInput: "#f7f8fc",
  bgTag: "#eef0f8",

  border: "#e4e7f0",
  borderLight: "#f0f2f8",

  text: "#111827",
  textSub: "#6b7280",
  textMuted: "#9ca3af",
  textInverse: "#ffffff",

  accent: "#5b5ef4",
  accentHover: "#4a4dd8",
  accentLight: "#eeeffd",

  success: "#10b981",
  successLight: "#d1fae5",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  info: "#3b82f6",
  infoLight: "#dbeafe",

  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.08)",
  shadowLg: "0 10px 40px rgba(0,0,0,0.12)",

  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

export const darkTheme = {
  name: "dark" as const,

  bg: "#0f1117",
  bgCard: "#1a1d27",
  bgSidebar: "#13151f",
  bgHover: "#22263a",
  bgInput: "#13151f",
  bgTag: "#22263a",

  border: "#2a2d3e",
  borderLight: "#1e2130",

  text: "#e8eaf6",
  textSub: "#8b92b3",
  textMuted: "#555a78",
  textInverse: "#ffffff",

  accent: "#6366f4",
  accentHover: "#7c7ff6",
  accentLight: "#1e2040",

  success: "#10b981",
  successLight: "#052e16",
  warning: "#f59e0b",
  warningLight: "#1c1407",
  danger: "#ef4444",
  dangerLight: "#1f0707",
  info: "#3b82f6",
  infoLight: "#0a1628",

  shadow: "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.4)",
  shadowLg: "0 10px 40px rgba(0,0,0,0.6)",

  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

export type AppTheme = typeof lightTheme;
