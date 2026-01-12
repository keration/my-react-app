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

function App() {
  const { themeColor, changeTheme, colorClassMap } = useTheme('blue');
  const [currentBackground, setCurrentBackground] = useState<BackgroundType>('star');
  // 仅保留防抖状态
  const [canFireConfetti, setCanFireConfetti] = useState(true);

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

  // 🌟 修改2：修改触发逻辑，改为持续喷射 + 防抖结束后停止
  const triggerConfetti = useCallback(() => {
    if (!canFireConfetti) return;
    setCanFireConfetti(false);

    // 启动持续喷射（使用默认200ms间隔，也可自定义：startContinuousConfetti(300)）
    startContinuousConfetti();

    // 防抖时间结束后：恢复可触发状态 + 停止持续喷射
    setTimeout(() => {
      setCanFireConfetti(true);
      stopContinuousConfetti(); // 停止礼花喷射
    }, CONFETTI_CONFIG.debounceTime);
  }, [canFireConfetti]);

  // 原有生命周期逻辑（无修改）
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeColor') as ThemeColor;
    if (savedTheme) changeTheme(savedTheme);

    const savedBackground = localStorage.getItem('backgroundType') as BackgroundType;
    if (savedBackground) setCurrentBackground(savedBackground);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('backgroundType', currentBackground);
  }, [currentBackground]);

  useEffect(() => {
    console.log(`当前用户列表：, ${userList.length}`);
    return () => console.log('用户列表组件卸载');
  }, [userList]);

  // 🌟 修改3：组件卸载时停止礼花（避免内存泄漏）
  useEffect(() => {
    return () => {
      stopContinuousConfetti();
    };
  }, []);

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

  // 添加用户逻辑（无修改，仅调用修改后的triggerConfetti）
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
    <div className="min-h-screen p-4 relative overflow-hidden">
      {renderBackground()}

      <BackgroundSelector
        currentBackground={currentBackground}
        onChangeBackground={setCurrentBackground}
        themeColor={themeColor}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {userList.map((user) => (
          <div key={user.id} className="mb-6 card-fade-in">
            <div
              className={`w-full rounded-lg animated-border shadow-lg card-hover-glow ${colorClassMap[themeColor].borderContainer}`}
            >
              <div className={`rounded-lg p-6 text-white ${colorClassMap[themeColor].card}`}>
                <UserProfile name={user.name} avatar={user.avatar} intro={user.intro} />
                <button
                  onClick={() => deleteUser(user.name)}
                  className="mt-2 px-3 py-1 rounded bg-white/20 hover:bg-white/30 btn-neon transition"
                  style={{ color: getThemeGlowColor(themeColor) }}
                >
                  删除该用户
                </button>
                <IntroEditor onChange={(newIntro) => updateUserIntro(user.name, newIntro)} />
              </div>
            </div>
          </div>
        ))}

        <ThemeButtonGroup onChangeTheme={changeTheme} />

        <button
          onClick={handleAddNewUser}
          className={`mt-4 px-4 py-2 rounded text-white ${colorClassMap[themeColor].button} transition btn-neon`}
          style={{ color: getThemeGlowColor(themeColor) }}
        >
          添加新用户
        </button>
      </div>
    </div>
  );
}

export default App;
