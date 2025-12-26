/** @type {import('tailwindcss').Config} */
export default {
  // 必须覆盖所有 .tsx 文件，插件才能解析类名
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 包含所有 TSX/JSX 文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
