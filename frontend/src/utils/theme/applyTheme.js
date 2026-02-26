import { THEME_COLORS } from "@/utils/constants";

const toCssVar = (key) =>
  `--color-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

export const applyThemeColors = (colors = THEME_COLORS) => {
  if (typeof document === "undefined") return;

  const rootStyle = document.documentElement.style;
  Object.entries(colors).forEach(([key, value]) => {
    rootStyle.setProperty(toCssVar(key), value);
  });
};

