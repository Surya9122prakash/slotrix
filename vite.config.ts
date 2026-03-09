import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'slotrix',
      formats: ['es', 'umd'],
      fileName: (format) => `slotrix.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'moment', 'moment-timezone'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          moment: 'moment',
          'moment-timezone': 'moment-timezone'
        }
      }
    }
  }
})
