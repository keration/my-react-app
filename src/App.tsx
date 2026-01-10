import ThemeButtonGroup from './components/ThemeButtonGroup.tsx';
import UserProfile from './components/UserProfile.tsx';
import IntroEditor from './components/IntroEditor.tsx';
import StarBackground from './components/StarBackground.tsx';
import { useTheme, getThemeGlowColor, ThemeColor } from './hooks/useTheme.ts';
import { useUserList } from './hooks/useUserList.ts';
import { useEffect } from 'react';

function App() {
  const { themeColor, changeTheme, colorClassMap } = useTheme('blue');

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeColor') as ThemeColor;
    if (savedTheme) {
      changeTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  useEffect(() => {
    console.log(`当前用户列表：, ${userList.length}`);
    return () => {
      console.log('用户列表组件卸载');
    };
  }, [userList]);

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <StarBackground />
      <div className="max-w-2xl mx-auto relative z-10">
        {userList.map((user) => (
          <div key={user.id} className="mb-6 card-fade-in">
            {/* 核心修改：移除 1px padding，改用 CSS 原生渐变边框 */}
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
          onClick={() =>
            addNewUser({
              id: Date.now() + Math.random(),
              name: `新用户${Date.now().toString().slice(-4)}`,
              avatar: `https://picsum.photos/${200 + userList.length}/${200 + userList.length}`,
              intro: '我是新增的用户 🆕',
            })
          }
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
