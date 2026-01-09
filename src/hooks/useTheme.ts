import { useState } from 'react';

export type ThemeColor = 'blue' | 'green' | 'purple';

export const getThemeGlowColor = (color: ThemeColor) => {
  const glowMap = {
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
  };
  return glowMap[color];
};

export const useTheme = (initialTheme: ThemeColor = 'blue') => {
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialTheme);
  const changeTheme = (color: ThemeColor) => {
    setThemeColor(color);
  };

  // 简化：仅保留主题色半透背景，无需底层遮挡（边框已用 CSS 隔离）
  const colorClassMap = {
    blue: {
      card: 'bg-blue-900/60 backdrop-blur-sm border border-blue-500/30',
      button:
        'bg-blue-800/80 hover:bg-blue-700/90 border border-blue-400/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40',
      borderContainer: 'text-blue-500',
    },
    green: {
      card: 'bg-green-900/60 backdrop-blur-sm border border-green-500/30',
      button:
        'bg-green-800/80 hover:bg-green-700/90 border border-green-400/50 shadow-lg shadow-green-500/20 hover:shadow-green-500/40',
      borderContainer: 'text-green-500',
    },
    purple: {
      card: 'bg-purple-900/60 backdrop-blur-sm border border-purple-500/30',
      button:
        'bg-purple-800/80 hover:bg-purple-700/90 border border-purple-400/50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40',
      borderContainer: 'text-purple-500',
    },
  };

  return { themeColor, changeTheme, colorClassMap };
};
