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
        if (url.endsWith('.ts') || url.endsWith('.tsx') || url.endsWith('.js') || url.includes('.ts?') || url.includes('.tsx?') || url.includes('.js?')) {
          return next();
        }
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

        if (url.startsWith('/api/sliders')) {
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
              const handler = (await import('./api/sliders')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/sliders dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/media')) {
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
              const handler = (await import('./api/media')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/media dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/admin-users')) {
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
              const handler = (await import('./api/admin-users')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/admin-users dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/settings')) {
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
              const handler = (await import('./api/settings')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/settings dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/client-logos')) {
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
              const handler = (await import('./api/client-logos')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/client-logos dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/page-headers')) {
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
              const handler = (await import('./api/page-headers')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/page-headers dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/company-profile')) {
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
              const handler = (await import('./api/company-profile')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/company-profile dev middleware error:', err);
              wrappedRes.status(500).json({ success: false, error: err.message });
            }
          });
          return;
        }

        if (url.startsWith('/api/campaigns')) {
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
              const handler = (await import('./api/campaigns')).default;
              await handler(wrappedReq, wrappedRes);
            } catch (err: any) {
              console.error('API /api/campaigns dev middleware error:', err);
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
      modulePreload: {
        polyfill: true,
      },
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
            }
          },
        },
      },
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
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
