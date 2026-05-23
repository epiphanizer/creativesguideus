export type CguThemeMode = "light" | "dark";

export const cguThemeStorageKey = "cgu-theme-mode";

export function isCguThemeMode(value: string | null | undefined): value is CguThemeMode {
  return value === "light" || value === "dark";
}

export function getCguThemeBootstrapScript() {
  return `(() => {
    const storageKey = ${JSON.stringify(cguThemeStorageKey)};
    const root = document.documentElement;
    let storedTheme = null;

    try {
      storedTheme = window.localStorage.getItem(storageKey);
    } catch {
      storedTheme = null;
    }

    const nextTheme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
  })();`;
}