import { useState, type ChangeEvent } from 'react';

interface IntroEditorProps {
  onChange: (newIntro: string) => void;
}
const IntroEditor: React.FC<IntroEditorProps> = ({ onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const customUpdateIntro = () => {
    onChange(inputValue);
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="输入新简介..."
        className="flex-1 px-3 py-2 rounded border border-white/30 bg-white/20 placeholder:text-white/70"
      />
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
