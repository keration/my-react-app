import { useState, useEffect, useCallback } from 'react';
import {
  CONFETTI_CONFIG,
  startContinuousConfetti,
  stopContinuousConfetti,
} from './utils/confettiUtils.ts';
import ThemeButtonGroup from './components/ThemeButtonGroup.tsx';
import UserProfile from './components/UserProfile.tsx';
import IntroEditor from './components/IntroEditor.tsx';
import StarBackground from './components/StarBackground.tsx';
import CyberGridBackground from './components/CyberGridBackground.tsx';
import ParticleWaveBackground from './components/ParticleWaveBackground.tsx';
import BackgroundSelector, { BackgroundType } from './components/BackgroundSelector.tsx';
import { useTheme, getThemeGlowColor, ThemeColor } from './hooks/useTheme.ts';
import { useUserList } from './hooks/useUserList.ts';

const setThemeVariables = (themeColor: ThemeColor) => {
  const glowColor = getThemeGlowColor(themeColor);
  document.documentElement.style.setProperty('--theme-glow', glowColor);
};

function App() {
  const { themeColor, changeTheme, colorClassMap } = useTheme('blue');
  const [currentBackground, setCurrentBackground] = useState<BackgroundType>('star');
  const [canFireConfetti, setCanFireConfetti] = useState(true);

  useEffect(() => {
    setThemeVariables(themeColor);
  }, [themeColor]);

  const { userList, addNewUser, deleteUser, updateUserIntro } = useUserList([
    {
      id: Date.now() + 1,
      name: 'React 新手',
      avatar: 'https://picsum.photos/200/200',
      intro: '这是我的第一个 React 页面 🚀',
    },
    {
      id: Date.now() + 2,
      name: 'TS 学习者',
      avatar: 'https://picsum.photos/201/201',
      intro: '我在学 TypeScript 类型约束 ✨',
    },
  ]);

  // 彩带动画触发逻辑
  const triggerConfetti = useCallback(() => {
    if (!canFireConfetti) return;
    setCanFireConfetti(false);
    startContinuousConfetti();
    setTimeout(() => {
      setCanFireConfetti(true);
      stopContinuousConfetti();
    }, CONFETTI_CONFIG.debounceTime);
  }, [canFireConfetti]);

  // 本地存储恢复主题/背景
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeColor') as ThemeColor;
    if (savedTheme) changeTheme(savedTheme);

    const savedBackground = localStorage.getItem('backgroundType') as BackgroundType;
    if (savedBackground) setCurrentBackground(savedBackground);
  }, []);

  // 主题/背景变更时持久化
  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('backgroundType', currentBackground);
  }, [currentBackground]);

  // 用户列表日志
  useEffect(() => {
    console.log(`当前用户列表：, ${userList.length}`);
    return () => console.log('用户列表组件卸载');
  }, [userList]);

  // 组件卸载停止彩带动画
  useEffect(() => {
    return () => {
      stopContinuousConfetti();
    };
  }, []);

  // 背景渲染逻辑
  const renderBackground = () => {
    switch (currentBackground) {
      case 'cyber':
        return <CyberGridBackground />;
      case 'particle':
        return <ParticleWaveBackground />;
      default:
        return <StarBackground />;
    }
  };

  // 添加新用户逻辑
  const handleAddNewUser = () => {
    addNewUser({
      id: Date.now() + Math.random(),
      name: `新用户${Date.now().toString().slice(-4)}`,
      avatar: `https://picsum.photos/${200 + userList.length}/${200 + userList.length}`,
      intro: '我是新增的用户 🆕',
    });
    triggerConfetti();
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden block">
      {/* 动态背景 */}
      {renderBackground()}

      {/* 背景选择器 */}
      <BackgroundSelector
        currentBackground={currentBackground}
        onChangeBackground={setCurrentBackground}
        themeColor={themeColor}
      />

      {/* 核心内容容器 */}
      <div className="w-96 mx-auto relative z-10 block">
        {/* 用户列表渲染 */}
        {userList.map((user) => (
          <div key={user.id} className="mb-6 card-fade-in block">
            <div
              className={`w-96 block mx-auto rounded-lg animated-border shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_var(--theme-glow)] ${colorClassMap[themeColor].borderContainer}`}
            >
              <div className={colorClassMap[themeColor].card}>
                {/* 用户信息展示 */}
                <UserProfile name={user.name} avatar={user.avatar} intro={user.intro} />
                <button
                  onClick={() => deleteUser(user.name)}
                  className="mt-2 px-3 py-1 rounded transition-all duration-300 text-[var(--theme-glow)] bg-white/20 hover:bg-white/30"
                >
                  删除该用户
                </button>
                {/* 简介编辑组件 */}
                <IntroEditor onChange={(newIntro) => updateUserIntro(user.name, newIntro)} />
              </div>
            </div>
          </div>
        ))}

        {/* 按钮组容器 */}
        <div className="w-96 block mx-auto">
          {/* 主题切换按钮组 */}
          <ThemeButtonGroup onChangeTheme={changeTheme} />
          <button
            onClick={handleAddNewUser}
            className={`w-full cursor-pointer transition-all duration-300 text-[var(--theme-glow)] ${colorClassMap[themeColor].button} hover:${colorClassMap[themeColor].buttonHover}`}
          >
            添加新用户
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
