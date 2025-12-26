// src/App.tsx
import React, { useState } from 'react';
import ThemeButtonGroup from './components/ThemeButtonGroup.tsx';
import UserProfile from './components/UserProfile.tsx';
import IntroEditor from './components/IntroEditor.tsx';

// Step 1：定义 TS 类型（约束数据结构，新手必学）
interface UserInfo {
  name: string;
  avatar: string;
  intro: string;
}

// Step 2：定义主题色类型（限定可选值，避免写错）
type ThemeColor = 'blue' | 'green' | 'purple';

function App() {
  // Step 3：用 useState 管理状态（交互的核心）
  // 1. 用户信息状态
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'React 新手',
    avatar: 'https://picsum.photos/200/200', // 占位头像
    intro: '这是我的第一个 React 页面 🚀',
  });
  // 2. 主题色状态
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');

  const [inputIntro, setInputIntro] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputIntro(e.target.value);
  };
  const customUpdateIntro = () => {
    if (inputIntro) {
      setUserInfo({ ...userInfo, intro: inputIntro });
      setInputIntro(''); // 清空输入框
    }
  };
  // Step 4：定义交互函数
  // 切换主题色
  const changeTheme = (color: ThemeColor) => {
    setThemeColor(color);
  };
  // 修改简介
  const updateIntro = () => {
    setUserInfo({
      ...userInfo, // 保留原有信息
      intro: '我学会 React 状态管理啦！',
    });
  };

  // Step 5：渲染页面（JSX + Tailwind 样式）
  // 映射主题色到 Tailwind 类名
  const colorClassMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* 信息卡片 */}
      <div
        className={`w-full max-w-md rounded-lg shadow-lg p-6 text-white ${colorClassMap[themeColor]}`}
      >
        <UserProfile name={userInfo.name} avatar={userInfo.avatar} intro={userInfo.intro} />

        {/* 主题色切换按钮组 */}
        <ThemeButtonGroup onChangeTheme={changeTheme} />
        <IntroEditor onChange={updateIntro} />

        {/* 修改简介按钮 */}
        <div className="flex justify-center">
          <button
            onClick={updateIntro}
            className="px-6 py-2 rounded bg-white text-blue-500 font-medium hover:bg-gray-100 transition"
          >
            修改简介
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
