/* eslint-disable */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'



// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy:{
      "/front":{
        target: loadEnv("",process.cwd()).VITE_PROXY_TARGET,
        changeOrigin: true,
      },
      "/boss":{
        target: loadEnv("",process.cwd()).VITE_PROXY_TARGET,
        changeOrigin: true,
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({prefix: 'Icon'},
        ),
      ],
      eslintrc: {
        enabled: true,
      }
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),//cnpm i @iconify-json/ep -D 安装图标库并且需要在依赖中加载依赖的版本
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
})
