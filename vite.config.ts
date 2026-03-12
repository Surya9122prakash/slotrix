import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'slotrix',
      formats: ['es', 'umd'],
      fileName: (format) => `slotrix.${format}.js`,
    },
    rollupOptions: {
      external: [/^react/, 'moment', 'moment-timezone'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          moment: 'moment',
          'moment-timezone': 'moment'
        }
      }
    }
  }
})
