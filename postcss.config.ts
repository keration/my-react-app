// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}, // 保留 autoprefixer（如果之前有）
  },
};
