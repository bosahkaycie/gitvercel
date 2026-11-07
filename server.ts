/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Production Node.js Server for Hostinger Node.js Applications, VPS, and Cloud Hosting
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Handlers
import sendEmailHandler from './api/send-email';
import uploadHandler from './api/upload';
import pageHeadersHandler from './api/page-headers';
import clientLogosHandler from './api/client-logos';
import adminUsersHandler from './api/admin-users';
import settingsHandler from './api/settings';
import slidersHandler from './api/sliders';
import mediaHandler from './api/media';
import companyProfileHandler from './api/company-profile';
import socialLinksHandler from './api/social-links';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, 'dist');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function setSecurityHeaders(res: http.ServerResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
}

function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Safeguard against unbounded memory consumption (10MB limit)
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        resolve({});
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve(body || {});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function wrapResponse(res: http.ServerResponse) {
  const wrapped: any = res;
  wrapped.status = function (statusCode: number) {
    res.statusCode = statusCode;
    return wrapped;
  };
  wrapped.json = function (data: any) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
    return wrapped;
  };
  return wrapped;
}

const server = http.createServer(async (req, res) => {
  setSecurityHeaders(res);

  const rawUrl = req.url || '/';
  const parsedUrl = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. API Routes Dispatcher
  if (pathname.startsWith('/api/')) {
    const wrappedRes = wrapResponse(res);
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? await parseBody(req) : {};
    const wrappedReq: any = req;
    wrappedReq.body = body;
    wrappedReq.query = Object.fromEntries(parsedUrl.searchParams.entries());

    try {
      if (pathname.startsWith('/api/send-email')) {
        return await sendEmailHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/upload')) {
        return await uploadHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/page-headers')) {
        return await pageHeadersHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/client-logos')) {
        return await clientLogosHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/admin-users')) {
        return await adminUsersHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/settings')) {
        return await settingsHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/sliders')) {
        return await slidersHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/media')) {
        return await mediaHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/company-profile')) {
        return await companyProfileHandler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith('/api/social-links')) {
        return await socialLinksHandler(wrappedReq, wrappedRes);
      }

      return wrappedRes.status(404).json({ success: false, error: 'API endpoint not found' });
    } catch (apiErr: any) {
      console.error(`Error handling ${pathname}:`, apiErr);
      return wrappedRes.status(500).json({ success: false, error: apiErr.message || 'Internal Server Error' });
    }
  }

  // 2. Static File Resolution
  let filePath = path.join(DIST_DIR, pathname);

  // If path is a directory or root, check for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Check if clean URL matches a pre-rendered static route (e.g. /about -> dist/about/index.html)
  if (!fs.existsSync(filePath)) {
    const candidateHtml = path.join(DIST_DIR, `${pathname}.html`);
    const candidateDirHtml = path.join(DIST_DIR, pathname, 'index.html');
    if (fs.existsSync(candidateHtml)) {
      filePath = candidateHtml;
    } else if (fs.existsSync(candidateDirHtml)) {
      filePath = candidateDirHtml;
    } else {
      // SPA Fallback: serve root index.html
      filePath = path.join(DIST_DIR, 'index.html');
    }
  }

  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);

  // Cache policy
  if (pathname.startsWith('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (ext === '.html') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }

  // Compression
  const acceptEncoding = (req.headers['accept-encoding'] as string) || '';
  const stat = fs.statSync(filePath);

  // Only compress text/code assets > 1KB
  const shouldCompress = stat.size > 1024 && (
    contentType.startsWith('text/') ||
    contentType.startsWith('application/javascript') ||
    contentType.startsWith('application/json') ||
    contentType.startsWith('image/svg+xml')
  );

  if (shouldCompress && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    res.removeHeader('Content-Length');
    fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
  } else if (shouldCompress && acceptEncoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
    res.removeHeader('Content-Length');
    fs.createReadStream(filePath).pipe(zlib.createDeflate()).pipe(res);
  } else {
    res.setHeader('Content-Length', stat.size);
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n======================================================`);
  console.log(`  Polaris Integrated & GeoSolutions (PIGL) Server`);
  console.log(`  Hostinger / Production Server listening on http://${HOST}:${PORT}`);
  console.log(`  Serving static assets from: ${DIST_DIR}`);
  console.log(`======================================================\n`);
});
