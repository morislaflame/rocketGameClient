import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nodePolyfills()],
  server: {
    allowedHosts: ['8bhwqk5vpbaz.share.zrok.io', 'localhost', 'uztxcmq864hd.share.zrok.io', 'kh69r3rj4rqe.share.zrok.io', '89.104.69.238' ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
