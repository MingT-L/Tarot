import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 将 train/ 目录作为静态资源目录
  // 文件在开发环境下通过 / 路径访问，构建时复制到 dist/ 根目录
  publicDir: 'train',
  // 构建优化配置
  build: {
    // 目标浏览器（支持原生 ES module 和 lazy loading）
    target: 'es2020',
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // chunk 大小警告阈值（KB）
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // 手动分包：将大型第三方库分离为独立 chunk
        manualChunks(id) {
          // Vue 核心运行时
          if (id.includes('node_modules/vue/dist') || id.includes('node_modules/vue/jsx')) {
            return 'vendor-vue'
          }
          // Vue 生态库（vue-router, pinia）
          if (id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) {
            return 'vendor-vue-ecosystem'
          }
        }
      }
    }
  },
  server: {
    fs: {
      // 允许访问 train/ 目录（位于项目根目录）
      allow: ['.', 'train']
    }
  }
})