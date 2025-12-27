import { useState, type ChangeEvent, type FC } from 'react';

// IntroEditor 组件：用于编辑用户简介的输入框和确认按钮
interface IntroEditorProps {
  onChange: (newIntro: string) => void; // 当简介更新时调用的回调函数
}

const IntroEditor: FC<IntroEditorProps> = ({ onChange }) => {
  // 输入框的值状态
  const [inputValue, setInputValue] = useState('');

  // 处理输入框变化的函数
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 自定义更新简介的函数
  const customUpdateIntro = () => {
    onChange(inputValue);
  };

  return (
    <div className="flex gap-2 mb-4">
      {/* 输入框：用户输入新简介 */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="输入新简介..."
        className="flex-1 px-3 py-2 rounded border border-white/30 bg-white/20 placeholder:text-white/70"
      />
      {/* 确认按钮：点击后更新简介 */}
      <button
        onClick={customUpdateIntro}
        className="px-3 py-2 rounded bg-white text-blue-500 font-medium"
      >
        确认
      </button>
    </div>
  );
};

export default IntroEditor;
