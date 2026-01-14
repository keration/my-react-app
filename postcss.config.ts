// postcss.config.js
export default {
  plugins: {
    // 移除旧的 tailwindcss 配置，改用新插件
    '@tailwindcss/postcss': {},
    autoprefixer: {}, // 保留 autoprefixer（如果之前有）
  },
};
