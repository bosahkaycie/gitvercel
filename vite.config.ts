import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import dotenv from 'dotenv';

dotenv.config();

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';
        if (url.startsWith('/api/send-email')) {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            const wrappedRes: any = res;
            wrappedRes.status = (statusCode: number) => {
              res.statusCode = statusCode;
              return wrappedRes;
            };
            wrappedRes.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return wrappedRes;
            };

            const wrappedReq: any = req;
            try {
              wrappedReq.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              wrappedReq.body = {};
            }

            try {
              const handler = (await import('./api/send-email')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/send-email dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/upload')) {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            const wrappedRes: any = res;
            wrappedRes.status = (statusCode: number) => {
              res.statusCode = statusCode;
              return wrappedRes;
            };
            wrappedRes.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return wrappedRes;
            };

            const wrappedReq: any = req;
            try {
              wrappedReq.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              wrappedReq.body = {};
            }

            try {
              const handler = (await import('./api/upload')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/upload dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Emergency Mode: Disable modulePreload to remove 'crossorigin' and 'rel="modulepreload"'
      modulePreload: false,
      rollupOptions: {
      },
      // Ensure source maps are off for emergency speed
      sourcemap: false,
    },
    plugins: [
      apiDevServerPlugin(),
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
