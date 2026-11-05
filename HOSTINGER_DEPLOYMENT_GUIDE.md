# Hostinger Production Deployment Guide for PIGL Website

This guide provides step-by-step instructions for deploying the **Polaris Integrated & GeoSolutions (PIGL)** website to **Hostinger**.

The codebase has been engineered to be **100% compatible** with both of Hostinger's hosting architectures:
- **Method 1 (Recommended for Standard Hosting):** Shared, Premium, or Business Web Hosting (Apache / LiteSpeed `public_html` + PHP mailer).
- **Method 2 (Recommended for Cloud / VPS):** Hostinger Node.js Application Manager or Hostinger VPS.

---

## Pre-Deployment Verification Summary

The project includes built-in configurations specifically tuned for Hostinger:
1. **SPA Routing on Apache / LiteSpeed:** `.htaccess` automatically routes virtual paths (`/about`, `/services`, `/admin`, `/careers`, etc.) to `index.html` while preserving direct access to assets. No 404 errors on browser refresh.
2. **Force HTTPS / SSL:** Automatic 301 redirection from HTTP to HTTPS on Hostinger.
3. **MIME Types & Caching:** Full support for modern `.webp`, `.avif`, `.woff2`, `.svg`, `.mp4` formats with 1-year immutable caching on hashed assets and `no-cache` on `index.html` to guarantee instant updates.
4. **Email Dispatcher Dual Compatibility:**
   - On Node.js: Handled via `server.mjs` / `api/send-email.ts` using Nodemailer and MXrouting SMTP.
   - On Shared PHP Hosting: Handled via `dist/api/send-email.php` with direct socket SMTP over SSL (Port 465) and local fallback.
5. **Direct Supabase Cloud Fallback:** Data hooks (`usePageHeaders`, `useClientLogos`, `useSiteSettings`, `useSupabaseData`) feature dual-tier persistence: calling `/api/*` when available, and falling back directly to authenticated Supabase storage (`media` bucket) when hosted purely as a static site.

---

## Method 1: Hostinger Shared / Premium / Business Web Hosting (`public_html`)

This is the standard, zero-maintenance method if you have Hostinger Shared, Premium, or Business Web Hosting.

### Step 1: Build the Production Bundle
On your local computer or CI pipeline, run:
```bash
npm run build
```
This produces the complete production package in the `dist/` directory, including:
- Pre-rendered static HTML routes for SEO
- Optimized JavaScript & CSS bundles with hashed filenames
- `dist/.htaccess` (configured for Hostinger Apache/LiteSpeed)
- `dist/api/send-email.php` (for contact forms, career applications, and vendor registration)

### Step 2: Upload to Hostinger `public_html`
1. Log in to your **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Navigate to **Websites** → Select your domain (`polarisigl.com`) → Click **Dashboard**.
3. Open **Files** → **File Manager** (or connect via **FTP / FileZilla** using your Hostinger FTP credentials).
4. Navigate inside the `public_html` directory:
   - If there is a default `default.php` or placeholder file, delete it.
5. Upload **all files and folders from inside your local `dist/` folder** directly into `public_html`.
   > **Important:** Ensure the hidden `.htaccess` file is uploaded into `public_html`. (In File Manager, ensure "Show hidden files" is enabled).

### Step 3: Verify the Live Website
1. Visit `https://polarisigl.com` — confirm the homepage loads.
2. Visit `https://polarisigl.com/about` and `https://polarisigl.com/services` directly in your browser address bar — confirm they load without 404.
3. Visit `https://polarisigl.com/admin` and log in with your superadmin credentials (`admin@polarisigl.com` / `password123`).
4. Test the Contact Form on `https://polarisigl.com/contact` — verify submission confirmation.

---

## Method 2: Hostinger Node.js Application Manager (Cloud Hosting / VPS)

If your Hostinger plan includes **Node.js** in hPanel (Cloud Startup/Professional/Enterprise, or VPS), you can run the full-stack Node.js server.

### Step 1: Prepare the Files
The repository includes `server.mjs`, a high-performance standalone server that serves the static frontend and executes all API handlers.

Ensure your environment variables are configured in `.env` (or set in Hostinger's environment variables dashboard):
```env
PORT=3000
VITE_SUPABASE_URL=https://jbldpfvceacfonkzzhig.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SMTP_HOST=glacier.mxrouting.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello@polarisigl.com
SMTP_PASS=your-smtp-password
SMTP_FROM="Polaris Integrated & GeoSolutions" <hello@polarisigl.com>
```

### Step 2: Configure Hostinger Node.js in hPanel
1. In **hPanel**, search for or navigate to **Node.js**.
2. Click **Create Application** (or manage existing).
3. Set the following fields:
   - **Node.js Version:** `20.x` or `22.x` (LTS)
   - **Application Root:** `/home/u.../domains/polarisigl.com/public_html` (or your project directory)
   - **Application Startup File:** `server.mjs`
   - **Application Mode:** `Production`
4. Upload your project files (or clone via **Git** repository integration in hPanel).
5. In the Node.js console / SSH terminal in hPanel, run:
   ```bash
   npm install --production
   npm run build
   ```
6. Click **Restart Application** or **Start**.

### Step 3: Verify Node.js Status
Test the healthcheck endpoint:
```bash
curl https://polarisigl.com/api/send-email
```
You should receive:
```json
{
  "status": "ready",
  "smtp_server": "glacier.mxrouting.net",
  "smtp_port": 465,
  "smtp_secure": true,
  "service": "Polaris Integrated & GeoSolutions Serverless Mail Dispatcher"
}
```

---

## DNS & Domain Setup on Hostinger

If your domain was purchased elsewhere or you are pointing it to Hostinger:

1. **A Record:**
   - Points `@` to your Hostinger server IP (found in hPanel under **Hosting Details**).
2. **CNAME Record:**
   - Points `www` to `polarisigl.com`.
3. **SSL Certificate (HTTPS):**
   - In hPanel, go to **Security** → **SSL**.
   - Click **Install SSL** (Hostinger provides free Let's Encrypt SSL with auto-renewal).
   - Ensure "Force HTTPS" is toggled ON.

---

## Testing & Verification Checklist

Before announcing live launch, run through this quick checklist:

| Check | Expected Behavior |
| :--- | :--- |
| **Homepage** | Fast initial render with video/image hero and client logo carousel |
| **Direct Navigation** | Direct visits to `/services`, `/about`, `/careers`, `/hsse` return HTTP 200 (not 404) |
| **Contact Form** | Submitting enquiry sends notification to `hello@polarisigl.com` and displays green success alert |
| **Admin Login** | Login at `/admin` works for `admin@polarisigl.com` |
| **CMS Headers** | In `/admin?tab=page-headers`, selecting page and clicking Save persists immediately |
| **Client Logos** | In `/admin?tab=clients`, adding or reordering logos persists on the public homepage |
| **SSL Padlock** | Browser address bar displays secure padlock (`https://`) |
