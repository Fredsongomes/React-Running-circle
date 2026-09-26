import { defineConfig, configDefaults } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    clearMocks: true,
    // o backend vive dentro desta pasta e tem a própria suíte (Jest)
    exclude: [...configDefaults.exclude, 'runner-circle-backend/**'],
  }
})
