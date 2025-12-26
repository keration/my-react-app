import React from 'react';

const ThemeButtonGroup: React.FC<{
  onChangeTheme: (color: 'blue' | 'green' | 'purple') => void;
}> = ({ onChangeTheme }) => {
  const themes: ('blue' | 'green' | 'purple')[] = ['blue', 'green', 'purple'];

  const themeLabels = {
    blue: '蓝色主题',
    green: '绿色主题',
    purple: '紫色主题',
  };

  return (
    <div className="flex justify-center gap-3 mb-6">
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => onChangeTheme(theme)}
          className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition"
        >
          {themeLabels[theme]}
        </button>
      ))}
    </div>
  );
};

export default ThemeButtonGroup;
