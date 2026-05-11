import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Emergency Mode: Disable modulePreload to remove 'crossorigin' and 'rel="modulepreload"'
      modulePreload: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          // Use predictable names for diagnostics
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        },
      },
      // Ensure source maps are off for emergency speed
      sourcemap: false,
    },
    plugins: [
      react(),
      ViteImageOptimizer({
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          quality: 80,
        },
        avif: {
          quality: 70,
        },
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
