import { defineConfig } from '@solidjs/start/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@i18n': path.resolve(__dirname, 'src/lib/i18n'),
        '@components': path.resolve(__dirname, 'src/components'),
      },
    },
  },
  server: {
    preset: 'cloudflare-pages',
    rollupConfig: {
      external: ['node:async_hooks'],
    },
  },
})
