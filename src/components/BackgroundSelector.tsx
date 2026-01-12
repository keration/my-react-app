import { useState, useEffect } from 'react';
import { ThemeColor } from '../hooks/useTheme';

// 定义背景类型
export type BackgroundType = 'star' | 'cyber' | 'particle' | 'gradient';

interface BackgroundSelectorProps {
  currentBackground: BackgroundType;
  onChangeBackground: (type: BackgroundType) => void;
  themeColor: ThemeColor;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onChangeBackground,
  themeColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // 主题发光颜色映射（不变）
  const glowColorMap = {
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
  };
  // 获取当前主题的发光色
  const currentGlowColor = glowColorMap[themeColor];

  // 背景选项列表
  const backgroundOptions = [
    { value: 'star', label: '星空背景' },
    { value: 'cyber', label: '赛博网格' },
    { value: 'particle', label: '粒子波纹' },
  ];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.background-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="background-selector absolute top-4 right-4 z-20">
      {/* 下拉按钮：修复自定义属性报错，直接拼接样式 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg bg-gray-800/80 text-white hover:bg-gray-700/80 transition-all border relative flex items-center gap-2"
        style={{
          boxShadow: `0 0 10px ${currentGlowColor}`, // 直接使用变量
          borderColor: currentGlowColor, // 直接使用变量
        }}
      >
        <span>切换背景</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}
        >
          <path
            d="M1 1L6 7L11 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 下拉菜单：同样修复自定义属性 */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-gray-800/95 text-white shadow-xl border overflow-hidden"
          style={{
            borderColor: currentGlowColor, // 直接使用变量
          }}
        >
          {backgroundOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChangeBackground(option.value as BackgroundType);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-700/80 transition-all flex items-center justify-between ${
                currentBackground === option.value ? 'bg-gray-700/60' : ''
              }`}
            >
              <span>{option.label}</span>
              {currentBackground === option.value && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: currentGlowColor }} // 直接使用变量
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackgroundSelector;
