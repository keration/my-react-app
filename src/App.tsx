import ThemeButtonGroup from './components/ThemeButtonGroup.tsx';
import UserProfile from './components/UserProfile.tsx';
import IntroEditor from './components/IntroEditor.tsx';
import StarBackground from './components/StarBackground.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { useUserList } from './hooks/useUserList.ts';

function App() {
  const { themeColor, changeTheme, colorClassMap } = useTheme('blue');

  const { userList, addNewUser, deleteUser, updateUserIntro } = useUserList([
    {
      name: 'React 新手',
      avatar: 'https://picsum.photos/200/200',
      intro: '这是我的第一个 React 页面 🚀',
    },
    {
      name: 'TS 学习者',
      avatar: 'https://picsum.photos/201/201',
      intro: '我在学 TypeScript 类型约束 ✨',
    },
  ]);

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <StarBackground />
      <div className="max-w-2xl mx-auto relative z-10">
        {/* 循环渲染每个用户卡片 */}
        {userList.map((user) => (
          <div key={user.name} className="mb-6">
            {/* 彩色流动边框外层（仅保留1px padding，边框极细） */}
            <div className="w-full rounded-lg animated-border shadow-lg" style={{ padding: '1px' }}>
              {/* 核心：单层卡片容器，无嵌套，直接承载所有样式 */}
              <div className={`rounded-lg p-6 text-white ${colorClassMap[themeColor].card}`}>
                <UserProfile name={user.name} avatar={user.avatar} intro={user.intro} />
                {/* 删除按钮 */}
                <button
                  onClick={() => deleteUser(user.name)}
                  className="mt-2 px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition"
                >
                  删除该用户
                </button>
                {/* 简介编辑器 */}
                <IntroEditor onChange={(newIntro) => updateUserIntro(user.name, newIntro)} />
              </div>
            </div>
          </div>
        ))}

        {/* 主题切换按钮组 */}
        <ThemeButtonGroup onChangeTheme={changeTheme} />

        {/* 添加用户按钮 */}
        <button
          onClick={() =>
            addNewUser({
              name: `新用户${Date.now().toString().slice(-4)}`,
              avatar: `https://picsum.photos/${200 + userList.length}/${200 + userList.length}`,
              intro: '我是新增的用户 🆕',
            })
          }
          className={`mt-4 px-4 py-2 rounded text-white ${colorClassMap[themeColor].button} transition`}
        >
          添加新用户
        </button>
      </div>
    </div>
  );
}

export default App;
