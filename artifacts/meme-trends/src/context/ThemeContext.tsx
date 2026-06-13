import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AppTheme = "cyber" | "dark" | "minimal";

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "cyber", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      return (localStorage.getItem("memeradar-theme") as AppTheme) || "cyber";
    } catch {
      return "cyber";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "minimal") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    try {
      localStorage.setItem("memeradar-theme", theme);
    } catch {}
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
