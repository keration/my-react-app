## 快速目标

- 目标：帮助 AI 编码代理快速上手本仓库的架构、约定与常用命令，避免常见错误（例如引入路径或样式破坏）。

## 快速命令

- 本地开发：`yarn dev`（vite dev，默认端口 3000）
- 生产构建：`yarn build`（会先运行 `tsc -b`，再执行 `vite build`）
- 预览构建：`yarn preview`（vite preview，默认 4000）
- 代码风格检查：`yarn lint`

## 项目概览（大局）

- 框架：React + TypeScript + Vite（见 [package.json](package.json) 与 [vite.config.ts](vite.config.ts)）。
- 样式：TailwindCSS + 少量自定义 CSS（核心样式在 [src/index.css](src/index.css)）。
- 文件布局：
  - 源码入口：[src/main.tsx](src/main.tsx)
  - 主要页面/容器：[src/App.tsx](src/App.tsx)
  - 可复用 UI：`src/components/*`（例如 `UserProfile.tsx`、`ThemeButtonGroup.tsx`）
  - 轻量状态/逻辑 Hook：`src/hooks/*`（例如 `useTheme.ts`、`useUserList.ts`）

## 关键约定与注意点（务必遵守）

- 导入路径与扩展名：代码里使用带扩展名的相对导入（例如 `import App from './App.tsx'`）。保持现有导入风格，避免移除 `.tsx/.ts` 扩展以免和编译器/工具链产生差异。
- Vite 别名：在 [vite.config.ts](vite.config.ts) 中配置了 `@`, `@assets`, `@components`。可使用这些别名，但检查 `resolve.extensions` 配置以确保扩展名匹配。
- Tailwind 扫描范围：`tailwind.config.js` 的 `content` 包含 `./src/**/*.{js,ts,jsx,tsx}`。新增 JSX/TSX 文件时，记得类名在编译时会被提取。
- 自定义样式类：`src/index.css` 定义了关键辅助类（例如 `animated-border`, `btn-neon`, `card-fade-in`, `card-hover-glow`）。修改这些类会全局影响卡片/按钮的视觉效果。
- 主题与样式绑定：`useTheme`（`src/hooks/useTheme.ts`）返回 `{ themeColor, changeTheme, colorClassMap }`。组件通过 `colorClassMap[themeColor].button/card/borderContainer` 来组合 Tailwind 类。
- 用户数据管理：`useUserList`（`src/hooks/useUserList.ts`）提供 `userList, addNewUser, deleteUser, updateUserIntro`。该 hook 使用用户名作为删除/更新的判定键（非 id），后续改动需谨慎以免破坏行为。
- id 生成：当前实现使用 `Date.now() + Math.random()` 生成 id；如果需要持久化或对接后端，请统一替换并注意迁移策略。

## 构建/运行细节与陷阱

- `yarn build` 会先执行 `tsc -b`：确保任何新增的 TS 项目引用/配置（如 `tsconfig.app.json`）与现有配置兼容。
- Vite 的 `optimizeDeps.include` 列出常用依赖（react、react-dom、axios、lodash-es），添加大型依赖时考虑同步更新以加速 dev 启动。
- `vite.config.ts` 中配置了 dev 代理 `/api`，使用时请通过环境变量 `VITE_API_BASE_URL` 管理目标地址。

## 代码修改示例（可直接参考）

- 切换主题：修改 `useTheme` 的 `colorClassMap`，组件已按 `colorClassMap[themeColor].button` 使用。
- 新增用户：调用 `addNewUser({ name, avatar, intro })`；注意 hook 会补充 `id`。
- 编辑简介：`IntroEditor` 触发 `onChange` 回调，App 通过 `updateUserIntro(user.name, newIntro)` 应用变更。

## 开发建议给 AI 代理（具体）

- 在改动样式或类名时，先检查 [src/index.css](src/index.css) 是否含有相关全局类，避免破坏全局动画或渐变边框。示例类：`animated-border`。
- 在改动导入路径时，保留或逐步迁移带扩展名的导入（仓库当前广泛使用 `.ts/.tsx` 后缀）。
- 修改 hooks（`useTheme` / `useUserList`）时，确保返回签名不变，以免破坏现有组件调用约定。
- 若需添加依赖或更新 chunk 策略，请同时检查 [vite.config.ts](vite.config.ts) 的 `manualChunks` 与 `optimizeDeps`，并运行 `npm run dev` 验证 HMR 行为。

## 重要文件参考

- [package.json](package.json)
- [vite.config.ts](vite.config.ts)
- [tailwind.config.js](tailwind.config.js)
- [src/index.css](src/index.css)
- [src/App.tsx](src/App.tsx)
- [src/hooks/useTheme.ts](src/hooks/useTheme.ts)
- [src/hooks/useUserList.ts](src/hooks/useUserList.ts)
- `src/components/*`

---

如果你希望我把其中某一节扩展为更详细的代码任务（例如重构 `useUserList` 以用 `id` 做主键，或把导入扩展名统一成无扩展名样式并调整配置），告诉我具体目标，我会生成修改补丁与测试建议。
