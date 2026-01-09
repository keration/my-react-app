import { useState } from 'react';

export type ThemeColor = 'blue' | 'green' | 'purple';

export const useTheme = (initialTheme: ThemeColor = 'blue') => {
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialTheme);
  const changeTheme = (color: ThemeColor) => {
    setThemeColor(color);
  };

  // 简化配置：单层卡片样式，无嵌套
  const colorClassMap = {
    blue: {
      card: 'bg-gray-900/95 bg-blue-900/60 backdrop-blur-sm border border-blue-500/30',
      button:
        'bg-blue-800/80 hover:bg-blue-700/90 border border-blue-400/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40',
    },
    green: {
      card: 'bg-gray-900/95 bg-green-900/60 backdrop-blur-sm border border-green-500/30',
      button:
        'bg-green-800/80 hover:bg-green-700/90 border border-green-400/50 shadow-lg shadow-green-500/20 hover:shadow-green-500/40',
    },
    purple: {
      card: 'bg-gray-900/95 bg-purple-900/60 backdrop-blur-sm border border-purple-500/30',
      button:
        'bg-purple-800/80 hover:bg-purple-700/90 border border-purple-400/50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40',
    },
  };

  return { themeColor, changeTheme, colorClassMap };
};
