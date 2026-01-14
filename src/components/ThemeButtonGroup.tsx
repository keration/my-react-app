import type { FC } from 'react';
import { getThemeGlowColor } from '../hooks/useTheme.ts'; // 复用全局主题色函数

type ThemeColor = 'blue' | 'green' | 'purple';

const ThemeButtonGroup: FC<{
  onChangeTheme: (color: ThemeColor) => void;
}> = ({ onChangeTheme }) => {
  const themes: ThemeColor[] = ['blue', 'green', 'purple'];

  const themeLabels = {
    blue: '蓝色主题',
    green: '绿色主题',
    purple: '紫色主题',
  };

  const handleBtnMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
  };
  const handleBtnMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  };

  return (
    <div className="flex justify-center gap-3 mb-6">
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => onChangeTheme(theme)}
          className="px-4 py-2 rounded transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: getThemeGlowColor(theme), // 文字颜色匹配主题色
            cursor: 'pointer',
          }}
          onMouseEnter={handleBtnMouseEnter}
          onMouseLeave={handleBtnMouseLeave}
        >
          {themeLabels[theme]}
        </button>
      ))}
    </div>
  );
};

export default ThemeButtonGroup;
