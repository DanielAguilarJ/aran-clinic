export const PALETTE = {
  gold: {
    primary: "#c8a84e",
    primaryHover: "#a68a3e",
    primaryLight: "#fef9c3",
    accent: "#d4af37",
  },
  rose: {
    primary: "#c4727f",
    primaryHover: "#a35d68",
    primaryLight: "#ffe4e6",
    accent: "#e8a0b0",
  },
} as const;

export const ACTIVE_PALETTE: "gold" | "rose" = "gold";
