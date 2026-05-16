import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Recupera preferência salva, padrão é dark
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  const isDark = theme === 'dark';

  // Aplica as variáveis CSS no :root toda vez que o tema mudar
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary',   '#111111');
      root.style.setProperty('--bg-surface',   '#1c1c1c');
      root.style.setProperty('--bg-input',     '#1a1a1a');
      root.style.setProperty('--border',       '#2a2a2a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary','#9ca3af');
      root.style.setProperty('--text-muted',   '#6b7280');
      root.style.setProperty('--nav-bg',       '#111111');
      root.style.setProperty('--nav-border',   '#1f1f1f');
    } else {
      root.style.setProperty('--bg-primary',   '#f9fafb');
      root.style.setProperty('--bg-surface',   '#ffffff');
      root.style.setProperty('--bg-input',     '#f3f4f6');
      root.style.setProperty('--border',       '#e5e7eb');
      root.style.setProperty('--text-primary', '#111111');
      root.style.setProperty('--text-secondary','#4b5563');
      root.style.setProperty('--text-muted',   '#9ca3af');
      root.style.setProperty('--nav-bg',       '#ffffff');
      root.style.setProperty('--nav-border',   '#e5e7eb');
    }
    document.body.style.backgroundColor = theme === 'dark' ? '#111111' : '#f9fafb';
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);