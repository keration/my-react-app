import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compressPlugin from 'vite-plugin-compression';
import path from 'path';
// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), '');
    const isProduction = mode === 'production';
    const isBuild = command === 'build';
    // 修复 manualChunks 类型问题：改为函数写法（兼容新版 Rollup/TS）
    const manualChunks = (id) => {
        // 拆分 React 核心依赖
        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'reactVendor';
        }
        // 拆分工具库
        if (id.includes('axios') || id.includes('lodash-es') || id.includes('date-fns')) {
            return 'utils';
        }
        // 拆分 UI 组件库（如有）
        // if (id.includes('antd') || id.includes('@mui')) {
        //   return 'ui'
        // }
    };
    return {
        // 基础配置
        base: env.VITE_APP_BASE_URL || '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@assets': path.resolve(__dirname, './src/assets'),
                '@components': path.resolve(__dirname, './src/components'),
            },
            extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
        },
        // 插件配置（修复类型问题，去掉 any[]）
        plugins: [
            // 修复：删除无效的 cacheDirectory 属性
            react({
                babel: {
                    plugins: [['babel-plugin-react-compiler']],
                },
            }),
            // 生产环境 - 包体积分析
            isBuild &&
                visualizer({
                    open: false,
                    filename: 'dist/stats.html',
                    gzipSize: true,
                    brotliSize: true,
                    template: 'treemap',
                }),
            // 生产环境 - 资源压缩
            isBuild &&
                compressPlugin({
                    verbose: false,
                    disable: !isProduction,
                    threshold: 10240,
                    algorithm: 'gzip',
                    ext: '.gz',
                }),
        ].filter(Boolean),
        // 构建优化（核心修复）
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            emptyOutDir: true,
            minify: isProduction ? 'esbuild' : false,
            sourcemap: !isProduction,
            cache: true,
            rollupOptions: {
                // Tree Shaking 配置
                treeshake: {
                    moduleSideEffects: 'no-external',
                    propertyReadSideEffects: false,
                    tryCatchDeoptimization: false,
                },
                output: {
                    // 自定义 chunk 命名
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name]-[hash].[ext]',
                    // 修复：使用函数写法的 manualChunks
                    manualChunks,
                },
            },
            modulePreload: {
                polyfill: false,
            },
            define: {
                'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
            },
            chunkSizeWarningLimit: 500,
        },
        // 依赖预构建
        optimizeDeps: {
            include: ['react', 'react-dom', 'axios', 'lodash-es'],
            esbuildOptions: {
                target: 'es2020',
            },
        },
        // 开发服务器
        server: {
            open: true,
            port: Number(env.VITE_APP_PORT) || 3000,
            host: '0.0.0.0',
            hmr: {
                overlay: false,
            },
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL || 'http://localhost:8080',
                    changeOrigin: true,
                },
            },
        },
        // 预览配置
        preview: {
            port: 4000,
            open: true,
        },
    };
});
