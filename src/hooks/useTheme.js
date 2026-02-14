import { useEffect, useState } from 'react';

const THEME_KEY = 'portfolio-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return window.localStorage.getItem(THEME_KEY) || 'dark';
};

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
};
