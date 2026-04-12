import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/theme';
import { GlobalStyles } from '../styles/GlobalStyles';

interface ThemeContextValue {
  isDark:      boolean;
  toggleTheme: () => void;
}

const ThemeCtx = createContext<ThemeContextValue>({} as ThemeContextValue);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('fw_theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('fw_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const theme = (isDark ? darkTheme : lightTheme) as DefaultTheme;

  return (
    <ThemeCtx.Provider value={{ isDark, toggleTheme: () => setIsDark((v) => !v) }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
