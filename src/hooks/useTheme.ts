import { useState } from 'react';

export type ThemeColor = 'blue' | 'green' | 'purple';

export const getThemeGlowColor = (color: ThemeColor) => {
  const glowMap = {
    blue: '#3b82f6', // blue-500
    green: '#22c55e', // green-500
    purple: '#a855f7', // purple-500
  };
  return glowMap[color];
};

export const useTheme = (initialTheme: ThemeColor = 'blue') => {
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialTheme);

  const changeTheme = (color: ThemeColor) => {
    setThemeColor(color);
  };

  const colorClassMap = {
    blue: {
      card: 'rounded-lg p-6 text-white border border-blue-500/30 bg-blue-900/60 backdrop-blur-sm',
      button:
        'rounded px-4 py-2 text-white border border-blue-400/50 transition-all duration-300 bg-blue-800/80 shadow-lg shadow-blue-500/20',
      buttonHover: 'bg-blue-700/90 shadow-blue-500/40',
      borderContainer: 'text-blue-500',
    },
    green: {
      card: 'rounded-lg p-6 text-white border border-green-500/30 bg-green-900/60 backdrop-blur-sm',
      button:
        'rounded px-4 py-2 text-white border border-green-400/50 transition-all duration-300 bg-green-800/80 shadow-lg shadow-green-500/20',
      buttonHover: 'bg-green-700/90 shadow-green-500/40',
      borderContainer: 'text-green-500',
    },
    purple: {
      card: 'rounded-lg p-6 text-white border border-purple-500/30 bg-purple-900/60 backdrop-blur-sm',
      button:
        'rounded px-4 py-2 text-white border border-purple-400/50 transition-all duration-300 bg-purple-800/80 shadow-lg shadow-purple-500/20',
      buttonHover: 'bg-purple-700/90 shadow-purple-500/40',
      borderContainer: 'text-purple-500',
    },
  };

  return { themeColor, changeTheme, colorClassMap };
};
