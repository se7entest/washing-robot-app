import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,
    // 禁用缓存
    cors: true,
    headers: {
      'Cache-Control': 'no-store'
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 强制每个文件有唯一hash
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
