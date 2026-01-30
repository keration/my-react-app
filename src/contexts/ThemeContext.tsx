// src/contexts/ThemeContext.tsx
import { createContext, useContext } from 'react';
import type { ThemeColor } from '../hooks/useTheme.ts';
import { useTheme } from '../hooks/useTheme.ts';

// 1. 创建 Context（定义上下文类型）
interface ThemeContextType {
  themeColor: ThemeColor;
  changeTheme: (color: ThemeColor) => void;
}
// 创建上下文，默认值设为 undefined（后续用 Provider 提供真实值）
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. 创建 Provider 组件（包裹需要共享主题的组件）
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { themeColor, changeTheme } = useTheme('blue'); // 复用原有主题逻辑
  return (
    <ThemeContext.Provider value={{ themeColor, changeTheme }}>{children}</ThemeContext.Provider>
  );
};

// 3. 创建自定义 Hook，简化 Context 使用（避免重复写 useContext + 类型判断）
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext 必须在 ThemeProvider 内部使用');
  }
  return context;
};
