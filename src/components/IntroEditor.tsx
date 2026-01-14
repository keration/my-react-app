import { useState, type ChangeEvent, type FC } from 'react';
import { ThemeColor, getThemeGlowColor } from '../hooks/useTheme.ts'; // 可选：保留主题色联动

interface IntroEditorProps {
  onChange: (newIntro: string) => void;
  themeColor?: ThemeColor; // 可选：主题色属性
}

const IntroEditor: FC<IntroEditorProps> = ({ onChange, themeColor = 'blue' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const customUpdateIntro = () => {
    onChange(inputValue);
  };

  return (
    <div className="flex gap-2 mb-4">
      {/* 🌟 修复1：删除 placeholderTextColor，添加自定义类名 "intro-editor-input" */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="输入新简介..."
        // 保留基础类 + 自定义类名（用于全局CSS定位）
        className="intro-editor-input flex-1 px-3 py-2 rounded border"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white', // 输入文字颜色
        }}
      />
      <button
        onClick={customUpdateIntro}
        className="px-3 py-2 rounded font-medium"
        style={{
          backgroundColor: 'white',
          color: getThemeGlowColor(themeColor), // 主题色联动（可选）
          cursor: 'pointer',
        }}
      >
        确认
      </button>
    </div>
  );
};

export default IntroEditor;
