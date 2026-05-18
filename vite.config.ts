import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: "3000",
    proxy: {
      "/site": { target: "https://testfront.vic999.vip", changeOrigin: true },
      "/user": { target: "https://testfront.vic999.vip", changeOrigin: true },
      "/file": { target: "https://testfront.vic999.vip", changeOrigin: true },
      "/gc-api": { target: "https://testfront.vic999.vip", changeOrigin: true },
      "/third-pay": { target: "https://testfront.vic999.vip", changeOrigin: true },
      "/social": { target: "https://testfront.vic999.vip", changeOrigin: true },
    },
  },
})
