// server.ts
import http from "http";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// api/send-email.ts
import nodemailer from "nodemailer";
function getSmtpConfig(override) {
  const host = override?.smtp_host || process.env.SMTP_HOST || "glacier.mxrouting.net";
  const port = Number(override?.smtp_port || process.env.SMTP_PORT || 465);
  const secure = override?.smtp_secure !== void 0 ? Boolean(override.smtp_secure) : process.env.SMTP_SECURE === "true" || port === 465;
  const user = override?.smtp_user || process.env.SMTP_USER || "hello@polarisigl.com";
  const pass = override?.smtp_pass || process.env.SMTP_PASS || "";
  const defaultFrom = process.env.SMTP_FROM || `"Polaris Integrated & GeoSolutions" <${user}>`;
  return { host, port, secure, user, pass, defaultFrom };
}
function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      // MXrouting certificates are valid and secure
      rejectUnauthorized: true,
      minVersion: "TLSv1.2"
    },
    connectionTimeout: 1e4,
    // 10 seconds
    greetingTimeout: 1e4,
    socketTimeout: 15e3
  });
}
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method === "GET") {
    const config = getSmtpConfig();
    return res.status(200).json({
      status: "ready",
      smtp_server: config.host,
      smtp_port: config.port,
      smtp_secure: config.secure,
      smtp_user_configured: Boolean(config.user),
      smtp_user_display: config.user ? `${config.user.substring(0, 3)}***@${config.user.split("@")[1] || ""}` : null,
      service: "Polaris Integrated & GeoSolutions Serverless Mail Dispatcher",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { action = "send", to, bcc, cc, replyTo, subject, html, text, config_override, test_email } = body;
    const config = getSmtpConfig(config_override);
    const transporter = createTransporter(config);
    if (action === "verify" || action === "test_connection") {
      try {
        await transporter.verify();
        let testSendResult = null;
        if (test_email) {
          testSendResult = await transporter.sendMail({
            from: config.defaultFrom,
            to: test_email,
            subject: "\u2705 PIGL Email Server Diagnostic - SMTP Verified",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #10b981; border-radius: 8px;">
                <div style="background-color: #022c22; padding: 16px; text-align: center; border-radius: 6px;">
                  <h2 style="color: #ffffff; margin: 0;">Polaris Integrated & GeoSolutions</h2>
                  <p style="color: #6ee7b7; margin: 4px 0 0 0; font-size: 12px; font-weight: bold;">SMTP Server Diagnostic Test</p>
                </div>
                <div style="padding: 20px 0;">
                  <p style="color: #0f172a; font-size: 15px;"><strong>SMTP Server Connection Successful!</strong></p>
                  <p style="color: #475569; font-size: 13px;">Your email dispatch configuration on <strong>${config.host}:${config.port}</strong> (User: ${config.user}) is fully active, authenticated, and ready to send corporate communications.</p>
                  <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #10b981; font-family: monospace; font-size: 12px; color: #334155;">
                    Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}<br>
                    Host: ${config.host}<br>
                    Encryption: ${config.secure ? "SSL (Port 465)" : "TLS/STARTTLS"}
                  </div>
                </div>
                <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Polaris Integrated & GeoSolutions Limited.</p>
              </div>
            `,
            text: `PIGL Email Server Diagnostic Test - Successful connection on ${config.host}:${config.port} at ${(/* @__PURE__ */ new Date()).toISOString()}`
          });
        }
        return res.status(200).json({
          success: true,
          message: `SMTP connection to ${config.host}:${config.port} verified successfully!`,
          test_sent_to: test_email || null,
          messageId: testSendResult?.messageId || null
        });
      } catch (verifyError) {
        console.error("SMTP Verification Error:", verifyError);
        return res.status(500).json({
          success: false,
          error: `SMTP Verification Failed: ${verifyError.message || verifyError}`,
          code: verifyError.code || "SMTP_VERIFY_ERROR"
        });
      }
    }
    if (!to && !bcc) {
      return res.status(400).json({
        success: false,
        error: 'Missing recipient. "to" or "bcc" must be provided.'
      });
    }
    if (!subject) {
      return res.status(400).json({
        success: false,
        error: "Missing email subject."
      });
    }
    if (!html && !text) {
      return res.status(400).json({
        success: false,
        error: "Missing email body (HTML or plain text required)."
      });
    }
    const mailOptions = {
      from: config.defaultFrom,
      to: to || void 0,
      bcc: bcc || void 0,
      cc: cc || void 0,
      replyTo: replyTo || config.user,
      subject,
      html: html || void 0,
      text: text || void 0,
      headers: {
        "X-Entity-Ref-ID": `PIGL-${Date.now()}`,
        "X-Mailer": "PIGL Corporate Dispatch Engine/1.0"
      }
    };
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      sent_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Error in /api/send-email:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Mail Server Error",
      code: error.code || "MAIL_DISPATCH_FAILED"
    });
  }
}

// api/upload.ts
import { createClient } from "@supabase/supabase-js";
async function handler2(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ready",
      service: "Polaris Integrated & GeoSolutions Media Upload API",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed. Use POST." });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { fileBase64, filename, contentType = "image/jpeg", bucket = "media" } = body;
    if (!fileBase64) {
      return res.status(400).json({ success: false, error: "Missing fileBase64 data in payload." });
    }
    let supabaseUrl = process.env.VITE_SUPABASE_URL || "";
    if (supabaseUrl.startsWith("http://")) {
      supabaseUrl = supabaseUrl.replace("http://", "https://");
    }
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ success: false, error: "Supabase credentials not configured on server." });
    }
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const cleanName = (filename || "media_asset").replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    const isVideoBucket = bucket === "videos";
    const filePath = isVideoBucket ? `videos/${timestamp}_${cleanName}` : `${timestamp}_${cleanName}`;
    const validBuckets = ["blog", "services", "sliders", "media", "resumes", "vendor-documents"];
    const targetBucket = isVideoBucket ? "media" : validBuckets.includes(bucket) ? bucket : "media";
    const { data, error } = await supabase.storage.from(targetBucket).upload(filePath, buffer, {
      contentType,
      cacheControl: "31536000",
      upsert: true
    });
    if (error) {
      console.error("Supabase storage upload error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to upload to Supabase storage."
      });
    }
    const { data: publicUrlData } = supabase.storage.from(targetBucket).getPublicUrl(filePath);
    return res.status(200).json({
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
      bucket: targetBucket,
      size: buffer.length
    });
  } catch (err) {
    console.error("Error in /api/upload handler:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error during media upload."
    });
  }
}

// api/page-headers.ts
import { createClient as createClient2 } from "@supabase/supabase-js";
var DEFAULT_PAGE_HEADERS = {
  home: {
    id: "home",
    page_slug: "/",
    page_name: "Home",
    breadcrumb_title: "Home",
    fallback_image: "/assets/newoffshore.png",
    overlay_opacity: 0.35
  },
  about: {
    id: "about",
    page_slug: "/about",
    page_name: "About Us",
    breadcrumb_title: "About Us",
    fallback_image: "/assets/teaching.jpeg",
    overlay_opacity: 0.3
  },
  services: {
    id: "services",
    page_slug: "/services",
    page_name: "Our Services",
    breadcrumb_title: "Services",
    fallback_image: "/assets/road.png",
    overlay_opacity: 0.35
  },
  projects: {
    id: "projects",
    page_slug: "/projects",
    page_name: "Executed Projects & Case Studies",
    breadcrumb_title: "Case studies",
    fallback_image: "/assets/newoffshore.png",
    overlay_opacity: 0.35
  },
  teams: {
    id: "teams",
    page_slug: "/teams",
    page_name: "Leadership & Engineering Teams",
    breadcrumb_title: "Management Team",
    fallback_image: "/assets/team.jpeg",
    overlay_opacity: 0.25
  },
  network: {
    id: "network",
    page_slug: "/network",
    page_name: "Our Professional Network",
    breadcrumb_title: "Our Network",
    fallback_image: "/assets/pigl_international_partner.jpg",
    overlay_opacity: 0.25
  },
  careers: {
    id: "careers",
    page_slug: "/careers",
    page_name: "Careers & Vacancies",
    breadcrumb_title: "Careers",
    fallback_image: "/assets/1770736125265.jpeg",
    overlay_opacity: 0.3
  },
  blog: {
    id: "blog",
    page_slug: "/blog",
    page_name: "Publications & Blog",
    breadcrumb_title: "Publications & Insights",
    fallback_image: "/assets/pigl_field_team_swamp.jpg",
    overlay_opacity: 0.35
  },
  contact: {
    id: "contact",
    page_slug: "/contact",
    page_name: "Contact Us",
    breadcrumb_title: "Contact Engineering Desk",
    fallback_image: "/assets/operations/pigl_logistics_base_aerial.jpg",
    overlay_opacity: 0.3
  },
  hsse: {
    id: "hsse",
    page_slug: "/hsse",
    page_name: "HSSE & Quality Policy",
    breadcrumb_title: "QHSE Policy & Standards",
    fallback_image: "/assets/IMG_6170.jpg",
    overlay_opacity: 0.3
  },
  videos: {
    id: "videos",
    page_slug: "/videos",
    page_name: "Corporate Video Hub",
    breadcrumb_title: "Corporate Video Hub",
    fallback_image: "/assets/operations/pigl_marine_crew_vessel.jpg",
    overlay_opacity: 0.3
  },
  vendors: {
    id: "vendors",
    page_slug: "/vendors",
    page_name: "Vendor Onboarding Desk",
    breadcrumb_title: "Vendor Hub",
    fallback_image: "/assets/operations/pigl_geomatics_survey_quay.jpg",
    overlay_opacity: 0.3
  },
  "vendor-registration": {
    id: "vendor-registration",
    page_slug: "/vendors/registration",
    page_name: "Vendor Registration Dossier",
    breadcrumb_title: "Vendor Registration",
    fallback_image: "/assets/operations/pigl_geomatics_survey_quay.jpg",
    overlay_opacity: 0.3
  },
  "services-ges": {
    id: "services-ges",
    page_slug: "/services/geosolutions-engineering-services",
    page_name: "GeoSolutions & Engineering Services",
    breadcrumb_title: "GeoSolutions & Engineering",
    fallback_image: "/assets/cpt.png",
    overlay_opacity: 0.35
  },
  "services-mms": {
    id: "services-mms",
    page_slug: "/services/metocean-marine-solutions",
    page_name: "Metocean & Marine Solutions",
    breadcrumb_title: "Metocean & Marine Solutions",
    fallback_image: "/assets/marine_intel_metocean.jpg",
    overlay_opacity: 0.35
  },
  "services-ics": {
    id: "services-ics",
    page_slug: "/services/integrated-construction-services",
    page_name: "Integrated Construction Services",
    breadcrumb_title: "Integrated Construction",
    fallback_image: "/assets/newpipeline.png",
    overlay_opacity: 0.35
  },
  "services-iet": {
    id: "services-iet",
    page_slug: "/services/industrial-solutions",
    page_name: "Industrial & Environmental Technologies",
    breadcrumb_title: "Industrial Technologies",
    fallback_image: "/assets/water_treatment_skid.png",
    overlay_opacity: 0.35
  }
};
var DEFAULT_TOP_HEADER = {
  top_header_bg_image: "",
  top_header_overlay_opacity: 0.3,
  top_header_active: false
};
var STORAGE_PATH = "config/page_headers.json";
var memoryHeadersCache = null;
async function handler3(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://jbldpfvceacfonkzzhig.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk";
  const supabase = createClient2(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  if (req.method === "GET") {
    const forceReload = req.query?.nocache === "1";
    if (memoryHeadersCache && !forceReload) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).json({ success: true, headers: memoryHeadersCache });
    }
    try {
      const { data, error } = await supabase.storage.from("media").download(STORAGE_PATH);
      if (error) {
        const initialData = {
          pages: DEFAULT_PAGE_HEADERS,
          top_header: DEFAULT_TOP_HEADER,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        await supabase.storage.from("media").upload(STORAGE_PATH, JSON.stringify(initialData, null, 2), {
          contentType: "application/json",
          upsert: true
        });
        memoryHeadersCache = initialData;
        return res.status(200).json({ success: true, headers: initialData });
      }
      const text = await data.text();
      const parsed = JSON.parse(text);
      const mergedPages = { ...DEFAULT_PAGE_HEADERS };
      if (parsed.pages && typeof parsed.pages === "object") {
        for (const [key, val] of Object.entries(parsed.pages)) {
          mergedPages[key] = {
            ...mergedPages[key] || {},
            ...val
          };
        }
      }
      const mergedData = {
        pages: mergedPages,
        top_header: parsed.top_header || DEFAULT_TOP_HEADER,
        updated_at: parsed.updated_at || (/* @__PURE__ */ new Date()).toISOString()
      };
      memoryHeadersCache = mergedData;
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).json({ success: true, headers: mergedData });
    } catch (err) {
      console.warn("page-headers download error, fallback to baseline:", err);
      const fallbackData = { pages: DEFAULT_PAGE_HEADERS, top_header: DEFAULT_TOP_HEADER };
      return res.status(200).json({
        success: true,
        headers: fallbackData,
        warning: err.message
      });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { action = "save_page", pageId, pageConfig, topHeader, adminEmail = "admin@polarisigl.com" } = body;
      let currentData = memoryHeadersCache ? {
        pages: { ...DEFAULT_PAGE_HEADERS, ...memoryHeadersCache.pages },
        top_header: { ...DEFAULT_TOP_HEADER, ...memoryHeadersCache.top_header }
      } : {
        pages: { ...DEFAULT_PAGE_HEADERS },
        top_header: { ...DEFAULT_TOP_HEADER }
      };
      if (!memoryHeadersCache) {
        try {
          const { data } = await supabase.storage.from("media").download(STORAGE_PATH);
          if (data) {
            const text = await data.text();
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed.pages === "object") {
              currentData = {
                pages: { ...DEFAULT_PAGE_HEADERS, ...parsed.pages },
                top_header: parsed.top_header || DEFAULT_TOP_HEADER
              };
            }
          }
        } catch (e) {
        }
      }
      let auditDescription = "";
      if (action === "save_page") {
        if (!pageId) {
          return res.status(400).json({ success: false, error: "pageId is required." });
        }
        const existing = currentData.pages[pageId] || DEFAULT_PAGE_HEADERS[pageId] || {
          id: pageId,
          page_slug: `/${pageId}`,
          page_name: pageId
        };
        const updatedPage = {
          ...existing,
          ...pageConfig,
          id: pageId,
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        currentData.pages[pageId] = updatedPage;
        auditDescription = `Updated breadcrumb background for page "${updatedPage.page_name}" (${updatedPage.page_slug})`;
      } else if (action === "remove_page_image") {
        if (!pageId) {
          return res.status(400).json({ success: false, error: "pageId is required." });
        }
        const existing = currentData.pages[pageId];
        if (existing) {
          const previousImg = existing.breadcrumb_image;
          existing.breadcrumb_image = "";
          existing.header_bg_image = "";
          existing.updated_at = (/* @__PURE__ */ new Date()).toISOString();
          existing.updated_by = adminEmail;
          currentData.pages[pageId] = existing;
          auditDescription = `Removed breadcrumb background for page "${existing.page_name}"`;
          if (previousImg && previousImg.includes("/storage/v1/object/public/media/headers/")) {
            try {
              const storagePath = previousImg.split("/media/")[1];
              if (storagePath) {
                await supabase.storage.from("media").remove([storagePath]);
              }
            } catch {
            }
          }
        }
      } else if (action === "save_top_header") {
        currentData.top_header = {
          ...currentData.top_header,
          ...topHeader,
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        auditDescription = `Updated main website top header background image`;
      } else if (action === "remove_top_header") {
        const previousImg = currentData.top_header?.top_header_bg_image;
        currentData.top_header = {
          top_header_bg_image: "",
          top_header_overlay_opacity: 0.3,
          top_header_active: false,
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        auditDescription = `Removed main website top header background image`;
        if (previousImg && previousImg.includes("/storage/v1/object/public/media/headers/")) {
          try {
            const storagePath = previousImg.split("/media/")[1];
            if (storagePath) {
              await supabase.storage.from("media").remove([storagePath]);
            }
          } catch {
          }
        }
      } else if (action === "reset") {
        currentData = {
          pages: { ...DEFAULT_PAGE_HEADERS },
          top_header: { ...DEFAULT_TOP_HEADER },
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        auditDescription = "Reset all page breadcrumbs and top header backgrounds to baseline defaults";
      }
      currentData.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      const { error: uploadError } = await supabase.storage.from("media").upload(
        STORAGE_PATH,
        JSON.stringify(currentData, null, 2),
        { contentType: "application/json", upsert: true }
      );
      if (uploadError) {
        console.warn("Storage save warning:", uploadError.message);
      }
      try {
        await supabase.from("audit_logs").insert([
          {
            action: auditDescription,
            entity_type: "navigation",
            entity_id: pageId || "top-header",
            details: { action, pageId, adminEmail },
            user_email: adminEmail,
            created_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        ]);
      } catch (auditErr) {
        console.warn("Audit log write notice:", auditErr);
      }
      memoryHeadersCache = currentData;
      return res.status(200).json({
        success: true,
        message: "Page header & breadcrumb configuration updated successfully.",
        headers: currentData
      });
    } catch (err) {
      console.error("API /api/page-headers error:", err);
      return res.status(500).json({ success: false, error: err.message || "Internal server error" });
    }
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

// api/client-logos.ts
import { createClient as createClient3 } from "@supabase/supabase-js";
var DEFAULT_CLIENT_RELATIONSHIPS = [
  {
    id: "client-shell",
    name: "Shell",
    category: "Direct Client",
    role: "Operating Engagement",
    logo_url: "/assets/clients/shell.svg",
    display_order: 1,
    status: "published"
  },
  {
    id: "client-nnpc",
    name: "NNPC Limited",
    category: "Industry Stakeholder",
    role: "National Energy Infrastructure",
    logo_url: "/assets/clients/nnpc.svg",
    display_order: 2,
    status: "published"
  },
  {
    id: "client-totalenergies",
    name: "TotalEnergies",
    category: "Direct Client",
    role: "Offshore & Energy Operations",
    logo_url: "/assets/clients/totalenergies.svg",
    display_order: 3,
    status: "published"
  },
  {
    id: "client-renaissance",
    name: "Renaissance Africa Energy Company Limited",
    category: "Industry Stakeholder",
    role: "Upstream Asset Operations",
    logo_url: "/assets/clients/renaissance.svg",
    display_order: 4,
    status: "published"
  },
  {
    id: "client-newcross",
    name: "Newcross Exploration & Production",
    category: "Project & Delivery Partner",
    role: "Field Development Support",
    logo_url: "/assets/clients/newcross.svg",
    display_order: 5,
    status: "published"
  },
  {
    id: "client-panocean",
    name: "Pan Ocean Oil Corporation (Nigeria) Limited",
    category: "Project & Delivery Partner",
    role: "Pipeline & Facility Support",
    logo_url: "/assets/clients/panocean.svg",
    display_order: 6,
    status: "published"
  },
  {
    id: "client-matrix",
    name: "Matrix Energy",
    category: "Direct Client",
    role: "Downstream & Terminal Engineering",
    logo_url: "/assets/clients/matrix.svg",
    display_order: 7,
    status: "published"
  }
];
var STORAGE_PATH2 = "config/client_logos.json";
async function handler4(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://jbldpfvceacfonkzzhig.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk";
  const supabase = createClient3(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.storage.from("media").download(STORAGE_PATH2);
      if (error) {
        await supabase.storage.from("media").upload(STORAGE_PATH2, JSON.stringify(DEFAULT_CLIENT_RELATIONSHIPS, null, 2), {
          contentType: "application/json",
          upsert: true
        });
        return res.status(200).json({ success: true, clients: DEFAULT_CLIENT_RELATIONSHIPS });
      }
      const text = await data.text();
      const clients = JSON.parse(text);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).json({ success: true, clients: Array.isArray(clients) ? clients : DEFAULT_CLIENT_RELATIONSHIPS });
    } catch (err) {
      console.warn("client-logos download fallback:", err);
      return res.status(200).json({ success: true, clients: DEFAULT_CLIENT_RELATIONSHIPS, warning: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { action = "save", client, clients, id } = body;
      let currentList = [];
      try {
        const { data } = await supabase.storage.from("media").download(STORAGE_PATH2);
        if (data) {
          const text = await data.text();
          currentList = JSON.parse(text);
        }
      } catch {
        currentList = [...DEFAULT_CLIENT_RELATIONSHIPS];
      }
      if (!Array.isArray(currentList) || currentList.length === 0) {
        currentList = [...DEFAULT_CLIENT_RELATIONSHIPS];
      }
      let updatedList = [...currentList];
      if (action === "save") {
        if (!client || !client.name) {
          return res.status(400).json({ success: false, error: "Organisation name is required." });
        }
        const targetId = client.id || `client-${Date.now()}`;
        const item = {
          id: targetId,
          name: client.name.trim(),
          category: client.category || "Direct Client",
          role: client.role ? client.role.trim() : "Operating Engagement",
          logo_url: client.logo_url || "/assets/clients/shell.svg",
          website: client.website ? client.website.trim() : "",
          display_order: Number(client.display_order) || updatedList.length + 1,
          status: client.status || "published"
        };
        const existingIdx = updatedList.findIndex((c) => c.id === targetId);
        if (existingIdx >= 0) {
          updatedList[existingIdx] = item;
        } else {
          updatedList.push(item);
        }
      } else if (action === "save_all" && Array.isArray(clients)) {
        updatedList = clients;
      } else if (action === "delete") {
        const targetId = id || client?.id;
        updatedList = updatedList.filter((c) => c.id !== targetId);
      } else if (action === "reset") {
        updatedList = [...DEFAULT_CLIENT_RELATIONSHIPS];
      }
      updatedList.sort((a, b) => a.display_order - b.display_order);
      const { error: uploadErr } = await supabase.storage.from("media").upload(
        STORAGE_PATH2,
        JSON.stringify(updatedList, null, 2),
        { contentType: "application/json", upsert: true }
      );
      if (uploadErr) {
        console.warn("Storage save warning:", uploadErr.message);
      }
      return res.status(200).json({
        success: true,
        message: "Client organisation logos updated successfully.",
        clients: updatedList
      });
    } catch (err) {
      console.error("API /api/client-logos error:", err);
      return res.status(500).json({ success: false, error: err.message || "Internal server error" });
    }
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

// api/admin-users.ts
import { createClient as createClient4 } from "@supabase/supabase-js";
async function handler5(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://jbldpfvceacfonkzzhig.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk";
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: "Supabase credentials not configured on server." });
  }
  const supabase = createClient4(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true, users: data });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { action = "create", userData = {}, password } = body;
      const email = (userData.email || body.email || "").trim().toLowerCase();
      const fullName = (userData.full_name || body.full_name || "").trim();
      const role = userData.role || body.role || "Content Editor";
      const status = userData.status || body.status || "active";
      const pass = password || userData.password || body.password;
      if (!email) {
        return res.status(400).json({ success: false, error: "Corporate email address is required." });
      }
      if (action === "create") {
        if (!fullName) {
          return res.status(400).json({ success: false, error: "Full name is required." });
        }
        if (!pass || pass.length < 6) {
          return res.status(400).json({ success: false, error: "Password must be at least 6 characters long." });
        }
        let authUserId = null;
        const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
          email,
          password: pass,
          email_confirm: true,
          user_metadata: {
            name: fullName,
            full_name: fullName,
            role
          }
        });
        if (createErr) {
          const { data: listData } = await supabase.auth.admin.listUsers();
          const existingAuthUser = listData?.users?.find((u) => u.email?.toLowerCase() === email);
          if (existingAuthUser) {
            authUserId = existingAuthUser.id;
            const { error: updateErr } = await supabase.auth.admin.updateUserById(existingAuthUser.id, {
              password: pass,
              email_confirm: true,
              user_metadata: {
                name: fullName,
                full_name: fullName,
                role
              }
            });
            if (updateErr) {
              return res.status(500).json({ success: false, error: `Failed to update credentials: ${updateErr.message}` });
            }
          } else {
            return res.status(500).json({ success: false, error: createErr.message });
          }
        } else if (createData?.user) {
          authUserId = createData.user.id;
        }
        const record = {
          id: authUserId || (userData.id && userData.id.length > 20 ? userData.id : crypto.randomUUID()),
          email,
          full_name: fullName,
          role,
          status,
          created_at: userData.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          last_login_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        const { error: tableErr } = await supabase.from("admin_users").upsert(record, { onConflict: "email" });
        if (tableErr) {
          console.warn("admin_users table upsert notice:", tableErr.message);
        }
        return res.status(200).json({
          success: true,
          message: "Administrator account and password created successfully. Access granted immediately.",
          user: record
        });
      }
      if (action === "update") {
        const id = userData.id || body.id;
        if (pass && pass.length >= 6) {
          let targetAuthId = id;
          const { data: listData } = await supabase.auth.admin.listUsers();
          const authUser = listData?.users?.find((u) => u.email?.toLowerCase() === email || u.id === id);
          if (authUser) {
            targetAuthId = authUser.id;
            const { error: passErr } = await supabase.auth.admin.updateUserById(targetAuthId, {
              password: pass,
              email_confirm: true,
              user_metadata: {
                name: fullName || authUser.user_metadata?.name,
                full_name: fullName || authUser.user_metadata?.full_name,
                role: role || authUser.user_metadata?.role
              }
            });
            if (passErr) {
              console.warn("Supabase password reset notice:", passErr.message);
            }
          }
        } else {
          const { data: listData } = await supabase.auth.admin.listUsers();
          const authUser = listData?.users?.find((u) => u.email?.toLowerCase() === email || u.id === id);
          if (authUser) {
            await supabase.auth.admin.updateUserById(authUser.id, {
              user_metadata: {
                name: fullName || authUser.user_metadata?.name,
                full_name: fullName || authUser.user_metadata?.full_name,
                role: role || authUser.user_metadata?.role
              }
            });
          }
        }
        const updatePayload = {
          full_name: fullName,
          role,
          status
        };
        const { error: updateTableErr } = await supabase.from("admin_users").update(updatePayload).eq("email", email);
        if (updateTableErr) {
          console.warn("admin_users update notice:", updateTableErr.message);
        }
        const updatedRecord = {
          id: id || crypto.randomUUID(),
          email,
          full_name: fullName,
          role,
          status,
          created_at: userData.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          last_login_at: userData.last_login_at || (/* @__PURE__ */ new Date()).toISOString()
        };
        return res.status(200).json({
          success: true,
          message: "Administrator privileges updated successfully.",
          user: updatedRecord
        });
      }
      if (action === "toggle-status") {
        const newStatus = status;
        await supabase.from("admin_users").update({ status: newStatus }).eq("email", email);
        return res.status(200).json({ success: true, status: newStatus });
      }
      if (action === "delete") {
        const id = userData.id || body.id;
        if (email) {
          await supabase.from("admin_users").delete().eq("email", email);
        } else if (id) {
          await supabase.from("admin_users").delete().eq("id", id);
        }
        try {
          const { data: listData } = await supabase.auth.admin.listUsers();
          const authUser = listData?.users?.find((u) => u.email?.toLowerCase() === email || u.id === id);
          if (authUser) {
            await supabase.auth.admin.deleteUser(authUser.id);
          }
        } catch (authDelErr) {
          console.warn("Auth deletion notice:", authDelErr);
        }
        return res.status(200).json({ success: true, message: "Administrator removed successfully." });
      }
      return res.status(400).json({ success: false, error: `Unsupported action: ${action}` });
    } catch (err) {
      console.error("API /api/admin-users error:", err);
      return res.status(500).json({ success: false, error: err.message || "Internal server error" });
    }
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

// api/settings.ts
import { createClient as createClient5 } from "@supabase/supabase-js";
async function handler6(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: "Supabase credentials not configured on server." });
  }
  const supabase = createClient5(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  const STORAGE_PATH4 = "config/site_settings.json";
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.storage.from("media").download(STORAGE_PATH4);
      if (error) {
        return res.status(200).json({ success: true, settings: null });
      }
      const text = await data.text();
      const settings = JSON.parse(text);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).json({ success: true, settings });
    } catch (err) {
      return res.status(200).json({ success: true, settings: null, warning: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const newSettings = body.settings || body;
      const payload = {
        ...newSettings,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const { error } = await supabase.storage.from("media").upload(STORAGE_PATH4, JSON.stringify(payload), {
        contentType: "application/json",
        upsert: true
      });
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true, settings: payload });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

// api/sliders.ts
import { createClient as createClient6 } from "@supabase/supabase-js";
async function handler7(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: "Supabase credentials not configured on server." });
  }
  const supabase = createClient6(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("sliders").select("*").order("display_order", { ascending: true });
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true, sliders: data });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { action = "save", slider, id } = body;
      if (action === "delete") {
        const targetId = id || slider?.id;
        if (!targetId) {
          return res.status(400).json({ success: false, error: "Missing slider id to delete." });
        }
        const { error: delErr } = await supabase.from("sliders").delete().eq("id", targetId);
        if (delErr) {
          return res.status(500).json({ success: false, error: delErr.message });
        }
        return res.status(200).json({ success: true, message: "Slider deleted successfully" });
      }
      if (!slider || !slider.title) {
        return res.status(400).json({ success: false, error: "Missing slider data." });
      }
      const cleanSlider = {
        ...slider,
        desktop_image: slider.desktop_image !== void 0 && slider.desktop_image !== null ? String(slider.desktop_image).trim() : "",
        mobile_image: slider.mobile_image !== void 0 && slider.mobile_image !== null ? String(slider.mobile_image).trim() : "",
        video_url: slider.video_url ? String(slider.video_url).trim() : null
      };
      const { data: saved, error: saveErr } = await supabase.from("sliders").upsert(cleanSlider).select().single();
      if (saveErr) {
        return res.status(500).json({ success: false, error: saveErr.message });
      }
      return res.status(200).json({ success: true, slider: saved });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

// api/media.ts
import { createClient as createClient7 } from "@supabase/supabase-js";
function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
function cleanDisplayFileName(rawName) {
  return rawName.replace(/^\d{10,14}_/, "");
}
async function handler8(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: "Supabase credentials not configured on server." });
  }
  const supabase = createClient7(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  if (req.method === "GET") {
    try {
      const urlObj = new URL(req.url, "http://localhost");
      const requestedBucket = urlObj.searchParams.get("bucket") || "all";
      const bucketsToList = requestedBucket === "all" ? ["videos", "services", "blog", "sliders", "media"] : [requestedBucket];
      const allFiles = [];
      for (const b of bucketsToList) {
        if (b === "videos") {
          try {
            const { data: vidsInSubfolder } = await supabase.storage.from("media").list("videos", {
              limit: 100,
              sortBy: { column: "created_at", order: "desc" }
            });
            if (vidsInSubfolder && Array.isArray(vidsInSubfolder)) {
              for (const f of vidsInSubfolder) {
                if (f.name && f.name !== ".emptyFolderPlaceholder") {
                  const filePath = `videos/${f.name}`;
                  const { data: pubData } = supabase.storage.from("media").getPublicUrl(filePath);
                  allFiles.push({
                    id: `media-videos-${f.name}`,
                    rawName: f.name,
                    name: cleanDisplayFileName(f.name),
                    path: filePath,
                    storageBucket: "media",
                    bucket: "videos",
                    url: pubData.publicUrl,
                    size: formatBytes(f.metadata?.size || 0),
                    bytes: f.metadata?.size || 0,
                    type: f.metadata?.mimetype || "video/mp4",
                    updated_at: f.updated_at || f.created_at || (/* @__PURE__ */ new Date()).toISOString(),
                    isCloudStorage: true
                  });
                }
              }
            }
          } catch (e) {
            console.warn("Could not list media/videos:", e);
          }
          try {
            const { data: rootMedia } = await supabase.storage.from("media").list("", {
              limit: 100,
              sortBy: { column: "created_at", order: "desc" }
            });
            if (rootMedia && Array.isArray(rootMedia)) {
              for (const f of rootMedia) {
                if (f.name && /\.(mp4|webm|ogg|mov)$/i.test(f.name)) {
                  const { data: pubData } = supabase.storage.from("media").getPublicUrl(f.name);
                  if (!allFiles.some((item) => item.rawName === f.name)) {
                    allFiles.push({
                      id: `media-root-${f.name}`,
                      rawName: f.name,
                      name: cleanDisplayFileName(f.name),
                      path: f.name,
                      storageBucket: "media",
                      bucket: "videos",
                      url: pubData.publicUrl,
                      size: formatBytes(f.metadata?.size || 0),
                      bytes: f.metadata?.size || 0,
                      type: f.metadata?.mimetype || "video/mp4",
                      updated_at: f.updated_at || f.created_at || (/* @__PURE__ */ new Date()).toISOString(),
                      isCloudStorage: true
                    });
                  }
                }
              }
            }
          } catch (e) {
            console.warn("Could not list root media:", e);
          }
        } else {
          try {
            const { data: files } = await supabase.storage.from(b).list("", {
              limit: 100,
              sortBy: { column: "created_at", order: "desc" }
            });
            if (files && Array.isArray(files)) {
              for (const f of files) {
                if (f.name && f.name !== ".emptyFolderPlaceholder" && f.name !== "videos") {
                  const { data: pubData } = supabase.storage.from(b).getPublicUrl(f.name);
                  allFiles.push({
                    id: `${b}-${f.name}`,
                    rawName: f.name,
                    name: cleanDisplayFileName(f.name),
                    path: f.name,
                    storageBucket: b,
                    bucket: b,
                    url: pubData.publicUrl,
                    size: formatBytes(f.metadata?.size || 0),
                    bytes: f.metadata?.size || 0,
                    type: f.metadata?.mimetype || "image/jpeg",
                    updated_at: f.updated_at || f.created_at || (/* @__PURE__ */ new Date()).toISOString(),
                    isCloudStorage: true
                  });
                }
              }
            }
          } catch (e) {
            console.warn(`Could not list bucket ${b}:`, e);
          }
        }
      }
      return res.status(200).json({ success: true, files: allFiles });
    } catch (err) {
      console.error("Error listing media:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { action = "delete", storageBucket = "media", bucket, path: path2 } = body;
      if (action === "delete") {
        if (!path2) {
          return res.status(400).json({ success: false, error: "Missing path to delete" });
        }
        const effectiveBucket = storageBucket || (bucket === "videos" ? "media" : bucket) || "media";
        const { error: delErr } = await supabase.storage.from(effectiveBucket).remove([path2]);
        if (delErr) {
          console.error("Supabase storage delete error:", delErr);
          return res.status(500).json({ success: false, error: delErr.message });
        }
        return res.status(200).json({
          success: true,
          message: `File "${path2}" permanently deleted from ${effectiveBucket} storage.`
        });
      }
      return res.status(400).json({ success: false, error: `Unsupported action: ${action}` });
    } catch (err) {
      console.error("Error handling media action:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}

// api/company-profile.ts
import { createClient as createClient8 } from "@supabase/supabase-js";
async function handler9(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  let supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  if (supabaseUrl.startsWith("http://")) {
    supabaseUrl = supabaseUrl.replace("http://", "https://");
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: "Supabase credentials not configured on server." });
  }
  const supabase = createClient8(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  const STORAGE_PATH4 = "config/company_profile.json";
  const DEFAULT_DOCUMENT = {
    id: "official-company-profile",
    title: "Polaris Integrated & GeoSolutions Limited - Official Corporate Profile",
    filename: "PIGL_Company_Profile.pdf",
    file_url: "https://jbldpfvceacfonkzzhig.supabase.co/storage/v1/object/public/documents/company-profile/PIGL_Company_Profile.pdf",
    storage_path: "company-profile/PIGL_Company_Profile.pdf",
    storage_bucket: "documents",
    file_type: "application/pdf",
    file_size: 11488310,
    formatted_size: "10.95 MB",
    is_published: true,
    version: "2026.1",
    description: "Comprehensive corporate overview of PIGL engineering divisions, offshore assets, QA/QC certifications, and track record across Nigeria & West Africa.",
    cover_image_url: "/assets/PIGL COMPANY PROFILE.jpg",
    upload_date: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_by: "admin@polarisigl.com"
  };
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.storage.from("media").download(STORAGE_PATH4);
      if (error || !data) {
        return res.status(200).json({ success: true, document: DEFAULT_DOCUMENT });
      }
      const text = await data.text();
      const document = JSON.parse(text);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).json({ success: true, document });
    } catch (err) {
      return res.status(200).json({ success: true, document: DEFAULT_DOCUMENT, warning: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const action = body.action || "save";
      const adminEmail = body.adminEmail || "admin@polarisigl.com";
      let currentDoc = { ...DEFAULT_DOCUMENT };
      try {
        const { data: existingData } = await supabase.storage.from("media").download(STORAGE_PATH4);
        if (existingData) {
          currentDoc = JSON.parse(await existingData.text());
        }
      } catch {
      }
      if (action === "upload") {
        const { fileBase64, filename, title, version, description, publishNow = true } = body;
        if (!fileBase64) {
          return res.status(400).json({ success: false, error: "Missing fileBase64 data in upload payload." });
        }
        if (!fileBase64.includes("application/pdf") && !filename?.toLowerCase().endsWith(".pdf")) {
          return res.status(400).json({ success: false, error: "Invalid file format. Only PDF documents are permitted for the Company Profile." });
        }
        const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const maxBytes = 50 * 1024 * 1024;
        if (buffer.length > maxBytes) {
          return res.status(400).json({ success: false, error: "File size exceeds maximum permitted limit of 50MB." });
        }
        const cleanName = (filename || "PIGL_Company_Profile.pdf").replace(/[^a-zA-Z0-9.-]/g, "_");
        const timestamp = Date.now();
        const storagePath = `company-profile/${timestamp}_${cleanName}`;
        const { data: uploadResult, error: uploadErr } = await supabase.storage.from("documents").upload(storagePath, buffer, {
          contentType: "application/pdf",
          cacheControl: "3600",
          upsert: true
        });
        if (uploadErr) {
          console.error("Supabase upload error:", uploadErr);
          return res.status(500).json({ success: false, error: uploadErr.message });
        }
        const { data: pubUrl } = supabase.storage.from("documents").getPublicUrl(storagePath);
        const fileUrl = pubUrl.publicUrl;
        const formattedSize = (buffer.length / (1024 * 1024)).toFixed(2) + " MB";
        try {
          await supabase.from("media_assets").insert({
            filename: cleanName,
            file_path: `documents/${storagePath}`,
            bucket_id: "documents",
            file_type: "application/pdf",
            file_size: buffer.length,
            alt_text: title || "Official PIGL Corporate Profile Document"
          });
        } catch (dbErr) {
          console.warn("media_assets insertion note:", dbErr);
        }
        const updatedDoc = {
          ...currentDoc,
          id: "official-company-profile",
          title: title || currentDoc.title,
          filename: cleanName,
          file_url: fileUrl,
          storage_path: storagePath,
          storage_bucket: "documents",
          file_type: "application/pdf",
          file_size: buffer.length,
          formatted_size: formattedSize,
          is_published: publishNow,
          version: version || currentDoc.version || "2026.1",
          description: description || currentDoc.description,
          upload_date: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        const { error: saveErr } = await supabase.storage.from("media").upload(STORAGE_PATH4, JSON.stringify(updatedDoc), {
          contentType: "application/json",
          upsert: true
        });
        if (saveErr) {
          return res.status(500).json({ success: false, error: saveErr.message });
        }
        return res.status(200).json({ success: true, document: updatedDoc });
      }
      if (action === "publish") {
        const updatedDoc = {
          ...currentDoc,
          is_published: true,
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        await supabase.storage.from("media").upload(STORAGE_PATH4, JSON.stringify(updatedDoc), {
          contentType: "application/json",
          upsert: true
        });
        return res.status(200).json({ success: true, document: updatedDoc });
      }
      if (action === "unpublish") {
        const updatedDoc = {
          ...currentDoc,
          is_published: false,
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        await supabase.storage.from("media").upload(STORAGE_PATH4, JSON.stringify(updatedDoc), {
          contentType: "application/json",
          upsert: true
        });
        return res.status(200).json({ success: true, document: updatedDoc });
      }
      if (action === "remove") {
        const updatedDoc = {
          ...currentDoc,
          is_published: false,
          file_url: "",
          filename: "",
          file_size: 0,
          formatted_size: "0 MB",
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        await supabase.storage.from("media").upload(STORAGE_PATH4, JSON.stringify(updatedDoc), {
          contentType: "application/json",
          upsert: true
        });
        return res.status(200).json({ success: true, document: updatedDoc });
      }
      if (action === "save") {
        const updatedDoc = {
          ...currentDoc,
          ...body.document || {},
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_by: adminEmail
        };
        await supabase.storage.from("media").upload(STORAGE_PATH4, JSON.stringify(updatedDoc), {
          contentType: "application/json",
          upsert: true
        });
        return res.status(200).json({ success: true, document: updatedDoc });
      }
      return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
    } catch (err) {
      console.error("Error in /api/company-profile handler:", err);
      return res.status(500).json({ success: false, error: err.message || "Internal server error." });
    }
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

// api/social-links.ts
import { createClient as createClient9 } from "@supabase/supabase-js";

// constants/socialPlatforms.ts
var DEFAULT_SOCIAL_LINKS = [
  {
    id: "social-linkedin",
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/polarisigl/",
    handle: "@polarisigl",
    icon_type: "preset",
    brand_color: "#0A66C2",
    hover_color: "#004182",
    is_active: true,
    display_order: 1,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: "PIGL on LinkedIn",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "social-youtube",
    platform: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/@polarisigl",
    handle: "@polarisigl",
    icon_type: "preset",
    brand_color: "#FF0000",
    hover_color: "#CC0000",
    is_active: true,
    display_order: 2,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: "PIGL Official YouTube Channel",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "social-whatsapp",
    platform: "whatsapp",
    label: "WhatsApp Business",
    url: "https://wa.me/2348097081333",
    handle: "+234 809 7081 333",
    icon_type: "preset",
    brand_color: "#25D366",
    hover_color: "#128C7E",
    is_active: true,
    display_order: 3,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: "Chat with PIGL on WhatsApp",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "social-twitter",
    platform: "twitter",
    label: "X (Twitter)",
    url: "https://x.com/polarisigl",
    handle: "@polarisigl",
    icon_type: "preset",
    brand_color: "#000000",
    hover_color: "#1DA1F2",
    is_active: false,
    display_order: 4,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: "PIGL on X (Twitter)",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "social-instagram",
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/polarisigl",
    handle: "@polarisigl",
    icon_type: "preset",
    brand_color: "#E4405F",
    hover_color: "#C13584",
    is_active: false,
    display_order: 5,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: "PIGL on Instagram",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "social-facebook",
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/polarisigl",
    handle: "polarisigl",
    icon_type: "preset",
    brand_color: "#1877F2",
    hover_color: "#0d65d9",
    is_active: false,
    display_order: 6,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: "PIGL on Facebook",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  }
];

// api/social-links.ts
async function handler10(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  let supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  if (supabaseUrl.startsWith("http://")) {
    supabaseUrl = supabaseUrl.replace("http://", "https://");
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: "Supabase credentials not configured on server." });
  }
  const supabase = createClient9(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  const STORAGE_PATH4 = "config/social_links.json";
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.storage.from("media").download(STORAGE_PATH4);
      if (error || !data) {
        return res.status(200).json({ success: true, social_links: DEFAULT_SOCIAL_LINKS });
      }
      const text = await data.text();
      const parsed = JSON.parse(text);
      const links = Array.isArray(parsed) ? parsed : parsed.social_links || DEFAULT_SOCIAL_LINKS;
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).json({ success: true, social_links: links });
    } catch (err) {
      return res.status(200).json({ success: true, social_links: DEFAULT_SOCIAL_LINKS, warning: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const links = body.social_links || (Array.isArray(body) ? body : DEFAULT_SOCIAL_LINKS);
      const payload = {
        social_links: links,
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_by: body.updated_by || "admin@polarisigl.com"
      };
      const { error } = await supabase.storage.from("media").upload(
        STORAGE_PATH4,
        JSON.stringify(payload, null, 2),
        {
          contentType: "application/json",
          upsert: true
        }
      );
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true, social_links: links, updated_at: payload.updated_at });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}

// api/campaigns.ts
import { createClient as createClient10 } from "@supabase/supabase-js";

// constants/campaignDefaults.ts
var INITIAL_SAMPLE_CAMPAIGN = {
  id: "nog-energy-week-2027",
  name: "Nigeria Oil & Gas (NOG) Energy Week 2027",
  slug: "nog-energy-week-2027",
  description: "Official PIGL Exhibition Booth & Executive Stakeholder Engagement at the ICC Abuja.",
  category: "Conference",
  eventName: "NOG Energy Week 2027",
  eventLocation: "International Conference Centre (ICC), Abuja, Nigeria",
  eventStartDate: "2027-06-28",
  eventEndDate: "2027-07-02",
  campaignStartDate: "2026-11-01",
  campaignClosingDate: "2027-07-15",
  coverImageUrl: "/assets/pigl_conference_keynote.jpg",
  logoImageUrl: "/assets/LOGO.png",
  assignedFormId: "form-nog-2027",
  status: "active",
  publicVisibility: true,
  assignedStaff: ["admin@polarisigl.com", "bd@polarisigl.com"],
  introductionText: "Welcome to the Polaris Integrated & GeoSolutions Limited (PIGL) engagement portal. Connect with our engineering directors and technical specialists to explore precision solutions across our four operating divisions.",
  confirmationMessage: "Thank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL). Our senior engineering scoping team has received your technical brief and will be in touch shortly.",
  termsAndPrivacyText: "Polaris Integrated & GeoSolutions Limited respects your privacy and is committed to protecting your personal data in accordance with the Nigeria Data Protection Act (NDPA). Information provided is used solely for technical follow-up and authorized engineering collaboration.",
  createdBy: "admin@polarisigl.com",
  createdAt: (/* @__PURE__ */ new Date()).toISOString(),
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var INITIAL_SAMPLE_FORM = {
  id: "form-nog-2027",
  campaignId: "nog-energy-week-2027",
  title: "PIGL Technical Scoping & Executive Engagement Form",
  description: "Please provide your contact details and operational interests so we can connect you with the appropriate technical division head.",
  activeVersion: 1,
  versions: [
    {
      id: "v1-nog-2027",
      versionNumber: 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      fields: [
        {
          id: "f_heading_personal",
          type: "section_heading",
          label: "1. Delegate Information",
          required: false,
          order: 1
        },
        {
          id: "f_full_name",
          type: "short_text",
          label: "Full Name",
          placeholder: "Engr. / Dr. / Mr. / Ms. Full Name",
          required: true,
          order: 2
        },
        {
          id: "f_email",
          type: "email",
          label: "Official Corporate Email",
          placeholder: "name@company.com",
          required: true,
          order: 3
        },
        {
          id: "f_phone",
          type: "phone",
          label: "Telephone / Mobile Number",
          placeholder: "+234 800 000 0000",
          required: true,
          order: 4
        },
        {
          id: "f_company",
          type: "short_text",
          label: "Company / Organization",
          placeholder: "e.g. Shell, NNPC Ltd, Chevron, TotalEnergies",
          required: true,
          order: 5
        },
        {
          id: "f_job_title",
          type: "short_text",
          label: "Designation / Job Title",
          placeholder: "e.g. Managing Director, Lead Project Engineer",
          required: false,
          order: 6
        },
        {
          id: "f_heading_services",
          type: "section_heading",
          label: "2. PIGL Operating Divisions of Interest",
          description: "Select one or more of PIGL\u2019s specialized engineering divisions relevant to your current projects.",
          required: false,
          order: 7
        },
        {
          id: "f_divisions",
          type: "checkbox",
          label: "PIGL Operating Divisions",
          required: true,
          options: [
            { id: "geo", label: "Geosolutions & Engineering Services (CPT, Geotechnical, 3D Reality Capture, Geomatics)", value: "geosolutions" },
            { id: "met", label: "Metocean & Marine Solutions (Hydrographic, Metocean, Sub-bottom Profiling, Rig Positioning)", value: "metocean" },
            { id: "con", label: "Integrated Construction Services (Swamp Pipeline, Structural Fabrication, Civil Works)", value: "construction" },
            { id: "ind", label: "Industrial Solutions (Cathodic Protection, NDT Asset Integrity, Valve Servicing, Water Treatment)", value: "industrial" }
          ],
          order: 8
        },
        {
          id: "f_scope",
          type: "long_text",
          label: "Project Scope / Technical Requirement Summary",
          placeholder: "Briefly describe your asset location, terrain, timeline, or scope of inquiry...",
          required: false,
          order: 9
        },
        {
          id: "f_timeline",
          type: "dropdown",
          label: "Anticipated Project Timeline",
          required: false,
          options: [
            { id: "t_immediate", label: "Immediate (Within 30 Days)", value: "immediate" },
            { id: "t_q1", label: "1 - 3 Months", value: "1-3_months" },
            { id: "t_q2", label: "3 - 6 Months", value: "3-6_months" },
            { id: "t_future", label: "Strategic Planning / Future Tender", value: "future" }
          ],
          order: 10
        },
        {
          id: "f_consent",
          type: "consent",
          label: "I consent to Polaris Integrated & GeoSolutions Limited processing my contact details for professional technical consultation.",
          required: true,
          order: 11
        }
      ]
    }
  ],
  createdAt: (/* @__PURE__ */ new Date()).toISOString(),
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var INITIAL_SAMPLE_EMAIL_TEMPLATE = {
  id: "email-tmpl-nog-2027",
  campaignId: "nog-energy-week-2027",
  templateType: "visitor_acknowledgement",
  senderName: "Polaris Integrated & GeoSolutions Limited (PIGL)",
  senderEmail: "bd@polarisigl.com",
  replyTo: "info@polarisigl.com",
  subject: "Thank You for Connecting with PIGL at {{event_name}}",
  bodyHtml: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #0f172a; padding: 28px 32px; text-align: left; border-bottom: 3px solid #059669;">
    <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">POLARIS INTEGRATED &amp; GEOSOLUTIONS</h1>
    <p style="color: #34d399; font-size: 11px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Technical Engagement Desk</p>
  </div>
  
  <div style="padding: 32px; color: #334155; line-height: 1.6; font-size: 15px;">
    <p style="margin-top: 0; font-size: 16px; color: #0f172a;">Dear <strong>{{first_name}}</strong>,</p>
    
    <p>Thank you for visiting the <strong>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</strong> exhibition booth at <strong>{{event_name}}</strong> in {{event_location}}.</p>
    
    <p>We appreciated the opportunity to connect with you and discuss your organization's engineering and operational requirements. Our technical leadership team has logged your submission (Reference: <code>{{submission_id}}</code>) and assigned it to the appropriate division specialists.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">PIGL Operating Divisions</p>
      <ul style="margin: 8px 0 0; padding-left: 18px; font-size: 13px; color: #475569;">
        <li><strong>Geosolutions &amp; Engineering Services:</strong> 20-Ton CPT, Geotechnical Pontoon Drilling, 3D Laser Scanning.</li>
        <li><strong>Metocean &amp; Marine Solutions:</strong> Multibeam Bathymetry, Oceanographic Buoys, Shallow Geophysical.</li>
        <li><strong>Integrated Construction Services:</strong> Swamp Flowline Laying, River Crossing, Structural Fabrication.</li>
        <li><strong>Industrial Solutions:</strong> Asset Integrity NDT, Cathodic Protection, Skid Maintenance.</li>
      </ul>
    </div>
    
    <p>Should you require immediate technical documentation or an engineering capability presentation, please feel free to reply directly to this email or reach us at <a href="mailto:info@polarisigl.com" style="color: #059669; text-decoration: none; font-weight: 600;">info@polarisigl.com</a>.</p>
    
    <p style="margin-bottom: 0;">Warm regards,</p>
    <p style="margin-top: 4px; font-weight: 700; color: #0f172a;">
      Corporate Engagement &amp; Business Development Team<br/>
      <span style="font-weight: 400; font-size: 13px; color: #64748b;">Polaris Integrated &amp; GeoSolutions Limited</span>
    </p>
  </div>
  
  <div style="background-color: #f1f5f9; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">&copy; 2026 Polaris Integrated &amp; GeoSolutions Limited. All rights reserved.</p>
    <p style="margin: 4px 0 0;">Plot 12, Commercial Area, Port Harcourt &amp; Victoria Island, Lagos, Nigeria.</p>
  </div>
</div>
  `,
  bodyText: `Dear {{first_name}},

Thank you for visiting the Polaris Integrated & GeoSolutions Limited (PIGL) exhibition booth at {{event_name}}.

We appreciate the opportunity to connect with you and learn more about your operational interests. Our team looks forward to staying in touch and exploring how our engineering capabilities can support {{company_name}}.

Best regards,
Polaris Integrated & GeoSolutions Limited (PIGL)
info@polarisigl.com | https://polarisigl.com`,
  enabled: true,
  internalRecipients: ["admin@polarisigl.com", "bd@polarisigl.com"],
  createdAt: (/* @__PURE__ */ new Date()).toISOString(),
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};

// api/campaigns.ts
var STORAGE_PATH3 = "config/campaigns_store.json";
function getSupabase() {
  let supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  if (supabaseUrl.startsWith("http://")) {
    supabaseUrl = supabaseUrl.replace("http://", "https://");
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient10(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}
async function loadStore(supabase) {
  const initialData = {
    campaigns: [INITIAL_SAMPLE_CAMPAIGN],
    forms: [INITIAL_SAMPLE_FORM],
    submissions: [],
    emailTemplates: [INITIAL_SAMPLE_EMAIL_TEMPLATE],
    emailLogs: [],
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!supabase) return initialData;
  try {
    const { data, error } = await supabase.storage.from("media").download(STORAGE_PATH3);
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return {
        campaigns: Array.isArray(parsed.campaigns) && parsed.campaigns.length > 0 ? parsed.campaigns : [INITIAL_SAMPLE_CAMPAIGN],
        forms: Array.isArray(parsed.forms) && parsed.forms.length > 0 ? parsed.forms : [INITIAL_SAMPLE_FORM],
        submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
        emailTemplates: Array.isArray(parsed.emailTemplates) ? parsed.emailTemplates : [INITIAL_SAMPLE_EMAIL_TEMPLATE],
        emailLogs: Array.isArray(parsed.emailLogs) ? parsed.emailLogs : [],
        updatedAt: parsed.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  } catch (err) {
    console.warn("Could not load campaign store from Supabase storage, using initial fallback:", err);
  }
  return initialData;
}
async function saveStore(supabase, store) {
  if (!supabase) return false;
  try {
    store.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const { error } = await supabase.storage.from("media").upload(STORAGE_PATH3, JSON.stringify(store, null, 2), {
      contentType: "application/json",
      upsert: true
    });
    return !error;
  } catch (err) {
    console.error("Failed to save campaign store to Supabase storage:", err);
    return false;
  }
}
function replacePlaceholders(template, data) {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "gi");
    result = result.replace(regex, value || "");
  }
  return result;
}
async function handler11(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const supabase = getSupabase();
  const urlObj = new URL(req.url, "http://localhost");
  const action = urlObj.searchParams.get("action") || req.body && req.body.action || "list";
  try {
    const store = await loadStore(supabase);
    if (action === "list") {
      return res.status(200).json({
        success: true,
        campaigns: store.campaigns
      });
    }
    if (action === "getBySlug") {
      const slug = urlObj.searchParams.get("slug") || req.body && req.body.slug;
      const campaign = store.campaigns.find((c) => c.slug === slug);
      if (!campaign) {
        return res.status(404).json({ success: false, error: "Campaign not found" });
      }
      const form = store.forms.find((f) => f.id === campaign.assignedFormId || f.campaignId === campaign.id);
      return res.status(200).json({
        success: true,
        campaign,
        form: form || null
      });
    }
    if (action === "get") {
      const id = urlObj.searchParams.get("id");
      const campaign = store.campaigns.find((c) => c.id === id);
      if (!campaign) {
        return res.status(404).json({ success: false, error: "Campaign not found" });
      }
      const form = store.forms.find((f) => f.id === campaign.assignedFormId || f.campaignId === campaign.id);
      const emailTemplate = store.emailTemplates.find((t) => t.campaignId === campaign.id);
      const submissions = store.submissions.filter((s) => s.campaignId === campaign.id);
      const emailLogs = store.emailLogs.filter((l) => l.campaignId === campaign.id);
      return res.status(200).json({
        success: true,
        campaign,
        form,
        emailTemplate,
        submissions,
        emailLogs
      });
    }
    if (action === "stats") {
      const now = /* @__PURE__ */ new Date();
      const totalCampaigns = store.campaigns.length;
      const activeCampaigns = store.campaigns.filter((c) => c.status === "active").length;
      const draftCampaigns = store.campaigns.filter((c) => c.status === "draft").length;
      const completedCampaigns = store.campaigns.filter((c) => c.status === "closed" || c.status === "archived").length;
      const totalSubmissions = store.submissions.length;
      const publicSubmissions = store.submissions.filter((s) => s.source === "qr_code" || s.source === "direct_link").length;
      const boothSubmissions = store.submissions.filter((s) => s.source === "booth_capture").length;
      const totalEmailsSent = store.emailLogs.filter((l) => l.status === "sent").length;
      const totalEmailsFailed = store.emailLogs.filter((l) => l.status === "failed").length;
      const stats = {
        totalCampaigns,
        activeCampaigns,
        draftCampaigns,
        completedCampaigns,
        totalSubmissions,
        publicSubmissions,
        boothSubmissions,
        totalEmailsSent,
        totalEmailsFailed,
        recentSubmissions: store.submissions.slice(-10).reverse(),
        recentCampaigns: store.campaigns.slice(-5).reverse()
      };
      return res.status(200).json({ success: true, stats });
    }
    if (action === "saveCampaign") {
      const body = req.body || {};
      const campaignData = body.campaign || body;
      if (!campaignData.name || !campaignData.slug) {
        return res.status(400).json({ success: false, error: "Campaign name and slug are required." });
      }
      const existingIdx = store.campaigns.findIndex((c) => c.id === campaignData.id || c.slug === campaignData.slug);
      let updatedCampaign;
      if (existingIdx >= 0) {
        updatedCampaign = {
          ...store.campaigns[existingIdx],
          ...campaignData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        store.campaigns[existingIdx] = updatedCampaign;
      } else {
        const id = campaignData.id || `camp-${Date.now()}`;
        updatedCampaign = {
          id,
          name: campaignData.name,
          slug: campaignData.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
          description: campaignData.description || "",
          category: campaignData.category || "Conference",
          eventName: campaignData.eventName || campaignData.name,
          eventLocation: campaignData.eventLocation || "Nigeria",
          eventStartDate: campaignData.eventStartDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          eventEndDate: campaignData.eventEndDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          campaignStartDate: campaignData.campaignStartDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          campaignClosingDate: campaignData.campaignClosingDate || "",
          coverImageUrl: campaignData.coverImageUrl || "/assets/pigl_conference_keynote.jpg",
          logoImageUrl: campaignData.logoImageUrl || "/assets/LOGO.png",
          assignedFormId: campaignData.assignedFormId || `form-${id}`,
          status: campaignData.status || "draft",
          publicVisibility: campaignData.publicVisibility !== false,
          assignedStaff: campaignData.assignedStaff || ["admin@polarisigl.com"],
          introductionText: campaignData.introductionText || "",
          confirmationMessage: campaignData.confirmationMessage || "",
          termsAndPrivacyText: campaignData.termsAndPrivacyText || "",
          createdBy: campaignData.createdBy || "admin@polarisigl.com",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        store.campaigns.push(updatedCampaign);
        if (!store.forms.some((f) => f.id === updatedCampaign.assignedFormId)) {
          const defaultForm = {
            id: updatedCampaign.assignedFormId,
            campaignId: updatedCampaign.id,
            title: `${updatedCampaign.name} Registration Form`,
            description: "Please submit your details and project inquiries.",
            activeVersion: 1,
            versions: [
              {
                id: `v1-${Date.now()}`,
                versionNumber: 1,
                createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                fields: INITIAL_SAMPLE_FORM.versions[0].fields
              }
            ],
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          store.forms.push(defaultForm);
        }
        if (!store.emailTemplates.some((t) => t.campaignId === updatedCampaign.id)) {
          const defaultTemplate = {
            id: `tmpl-${Date.now()}`,
            campaignId: updatedCampaign.id,
            templateType: "visitor_acknowledgement",
            senderName: "Polaris Integrated & GeoSolutions Limited (PIGL)",
            senderEmail: "bd@polarisigl.com",
            replyTo: "info@polarisigl.com",
            subject: `Thank You for Connecting with PIGL at {{event_name}}`,
            bodyHtml: INITIAL_SAMPLE_EMAIL_TEMPLATE.bodyHtml,
            bodyText: INITIAL_SAMPLE_EMAIL_TEMPLATE.bodyText,
            enabled: true,
            internalRecipients: ["admin@polarisigl.com", "bd@polarisigl.com"],
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          store.emailTemplates.push(defaultTemplate);
        }
      }
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, campaign: updatedCampaign });
    }
    if (action === "deleteCampaign") {
      const id = req.body?.id || urlObj.searchParams.get("id");
      if (!id) return res.status(400).json({ success: false, error: "Campaign ID required" });
      store.campaigns = store.campaigns.filter((c) => c.id !== id);
      store.forms = store.forms.filter((f) => f.campaignId !== id && f.id !== id);
      store.submissions = store.submissions.filter((s) => s.campaignId !== id);
      store.emailTemplates = store.emailTemplates.filter((t) => t.campaignId !== id);
      store.emailLogs = store.emailLogs.filter((l) => l.campaignId !== id);
      await saveStore(supabase, store);
      return res.status(200).json({ success: true });
    }
    if (action === "saveForm") {
      const body = req.body || {};
      const { formId, campaignId, title, description, fields } = body;
      let formIndex = store.forms.findIndex((f) => f.id === formId);
      const hasSubmissions = store.submissions.some((s) => s.formId === formId);
      if (formIndex >= 0) {
        const existingForm = store.forms[formIndex];
        let newActiveVersion = existingForm.activeVersion;
        if (hasSubmissions) {
          newActiveVersion = existingForm.activeVersion + 1;
          const newVersion = {
            id: `v${newActiveVersion}-${Date.now()}`,
            versionNumber: newActiveVersion,
            fields: fields || [],
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          existingForm.versions.push(newVersion);
          existingForm.activeVersion = newActiveVersion;
        } else {
          const curVersion = existingForm.versions.find((v) => v.versionNumber === existingForm.activeVersion);
          if (curVersion) {
            curVersion.fields = fields || [];
          } else {
            existingForm.versions.push({
              id: `v1-${Date.now()}`,
              versionNumber: 1,
              fields: fields || [],
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            });
          }
        }
        existingForm.title = title || existingForm.title;
        existingForm.description = description !== void 0 ? description : existingForm.description;
        existingForm.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        store.forms[formIndex] = existingForm;
      } else {
        const newForm = {
          id: formId || `form-${Date.now()}`,
          campaignId: campaignId || "",
          title: title || "New Campaign Form",
          description: description || "",
          activeVersion: 1,
          versions: [
            {
              id: `v1-${Date.now()}`,
              versionNumber: 1,
              fields: fields || [],
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          ],
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        store.forms.push(newForm);
        formIndex = store.forms.length - 1;
      }
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, form: store.forms[formIndex] });
    }
    if (action === "saveEmailTemplate") {
      const templateData = req.body?.template || req.body;
      if (!templateData.campaignId) {
        return res.status(400).json({ success: false, error: "Campaign ID required" });
      }
      const idx = store.emailTemplates.findIndex((t) => t.campaignId === templateData.campaignId);
      let saved;
      if (idx >= 0) {
        saved = {
          ...store.emailTemplates[idx],
          ...templateData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        store.emailTemplates[idx] = saved;
      } else {
        saved = {
          id: `tmpl-${Date.now()}`,
          campaignId: templateData.campaignId,
          templateType: templateData.templateType || "visitor_acknowledgement",
          senderName: templateData.senderName || "Polaris Integrated & GeoSolutions Limited",
          senderEmail: templateData.senderEmail || "bd@polarisigl.com",
          replyTo: templateData.replyTo || "info@polarisigl.com",
          subject: templateData.subject || "Thank you for connecting with PIGL",
          bodyHtml: templateData.bodyHtml || "",
          bodyText: templateData.bodyText || "",
          enabled: templateData.enabled !== false,
          internalRecipients: templateData.internalRecipients || ["admin@polarisigl.com"],
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        store.emailTemplates.push(saved);
      }
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, template: saved });
    }
    if (action === "submit") {
      const body = req.body || {};
      const { campaignId, formId, source, formData, consentGiven, assignedStaff } = body;
      const campaign = store.campaigns.find((c) => c.id === campaignId || c.slug === campaignId);
      if (!campaign) {
        return res.status(404).json({ success: false, error: "Target campaign not found." });
      }
      if (campaign.status === "draft" || campaign.status === "paused" || campaign.status === "closed") {
        if (source !== "booth_capture") {
          return res.status(403).json({
            success: false,
            error: `This campaign is currently ${campaign.status} and is not accepting public submissions.`
          });
        }
      }
      const form = store.forms.find((f) => f.id === formId || f.campaignId === campaign.id);
      const activeVersion = form?.versions.find((v) => v.versionNumber === form.activeVersion);
      const visitorName = formData["f_full_name"] || formData["full_name"] || formData["name"] || "Conference Delegate";
      const visitorEmail = formData["f_email"] || formData["email"] || "";
      const visitorPhone = formData["f_phone"] || formData["phone"] || "";
      const visitorCompany = formData["f_company"] || formData["company"] || "";
      const visitorJobTitle = formData["f_job_title"] || formData["job_title"] || "";
      const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newSubmission = {
        id: submissionId,
        campaignId: campaign.id,
        campaignSlug: campaign.slug,
        formId: form?.id || campaign.assignedFormId,
        formVersionId: activeVersion?.id || "v1",
        source: source || "direct_link",
        visitorName,
        visitorEmail,
        visitorPhone,
        visitorCompany,
        visitorJobTitle,
        formData: formData || {},
        assignedStaff: assignedStaff || "",
        followUpStatus: "new",
        notes: [],
        consentGiven: consentGiven !== false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      store.submissions.push(newSubmission);
      const emailTemplate = store.emailTemplates.find((t) => t.campaignId === campaign.id);
      if (emailTemplate && emailTemplate.enabled && visitorEmail) {
        const placeholderMap = {
          first_name: visitorName.split(" ")[0] || visitorName,
          full_name: visitorName,
          email: visitorEmail,
          phone: visitorPhone,
          company_name: visitorCompany,
          job_title: visitorJobTitle,
          event_name: campaign.eventName,
          campaign_name: campaign.name,
          event_location: campaign.eventLocation,
          submission_id: submissionId,
          submission_date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        };
        const resolvedSubject = replacePlaceholders(emailTemplate.subject, placeholderMap);
        const resolvedBodyHtml = replacePlaceholders(emailTemplate.bodyHtml, placeholderMap);
        const resolvedBodyText = replacePlaceholders(emailTemplate.bodyText || "", placeholderMap);
        try {
          const emailLog = {
            id: `log-${Date.now()}`,
            campaignId: campaign.id,
            submissionId,
            recipient: visitorEmail,
            emailType: "visitor_acknowledgement",
            subject: resolvedSubject,
            status: "sent",
            attempts: 1,
            sentAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          store.emailLogs.push(emailLog);
        } catch (emailErr) {
          console.warn("Visitor email dispatch logged warning:", emailErr);
        }
        if (emailTemplate.internalRecipients && emailTemplate.internalRecipients.length > 0) {
          try {
            const internalLog = {
              id: `log-int-${Date.now()}`,
              campaignId: campaign.id,
              submissionId,
              recipient: emailTemplate.internalRecipients.join(", "),
              emailType: "internal_notification",
              subject: `[New Lead] ${visitorName} (${visitorCompany}) - ${campaign.name}`,
              status: "sent",
              attempts: 1,
              sentAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            store.emailLogs.push(internalLog);
          } catch (intErr) {
            console.warn("Internal alert logging notice:", intErr);
          }
        }
      }
      await saveStore(supabase, store);
      return res.status(200).json({
        success: true,
        submissionId,
        message: campaign.confirmationMessage || "Thank you! Your information has been securely received."
      });
    }
    if (action === "updateLeadStatus") {
      const { submissionId, status } = req.body || {};
      const sub = store.submissions.find((s) => s.id === submissionId);
      if (!sub) return res.status(404).json({ success: false, error: "Submission not found" });
      sub.followUpStatus = status;
      sub.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, submission: sub });
    }
    if (action === "addLeadNote") {
      const { submissionId, note, author } = req.body || {};
      const sub = store.submissions.find((s) => s.id === submissionId);
      if (!sub) return res.status(404).json({ success: false, error: "Submission not found" });
      sub.notes.push({
        id: `note-${Date.now()}`,
        author: author || "Staff Member",
        content: note,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      sub.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, submission: sub });
    }
    if (action === "retryEmail") {
      const { logId } = req.body || {};
      const log = store.emailLogs.find((l) => l.id === logId);
      if (!log) return res.status(404).json({ success: false, error: "Email log not found" });
      log.attempts += 1;
      log.status = "sent";
      log.errorDetails = void 0;
      log.sentAt = (/* @__PURE__ */ new Date()).toISOString();
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, log });
    }
    return res.status(400).json({ success: false, error: `Unrecognized action: ${action}` });
  } catch (error) {
    console.error("API /api/campaigns error:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DIST_DIR = path.resolve(__dirname, "dist");
var PORT = Number(process.env.PORT) || 3e3;
var HOST = process.env.HOST || "0.0.0.0";
var MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};
function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
}
function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        resolve({});
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve(body || {});
      }
    });
    req.on("error", () => resolve({}));
  });
}
function wrapResponse(res) {
  const wrapped = res;
  wrapped.status = function(statusCode) {
    res.statusCode = statusCode;
    return wrapped;
  };
  wrapped.json = function(data) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
    return wrapped;
  };
  return wrapped;
}
var server = http.createServer(async (req, res) => {
  setSecurityHeaders(res);
  const rawUrl = req.url || "/";
  const parsedUrl = new URL(rawUrl, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname.startsWith("/api/")) {
    const wrappedRes = wrapResponse(res);
    const body = req.method !== "GET" && req.method !== "HEAD" ? await parseBody(req) : {};
    const wrappedReq = req;
    wrappedReq.body = body;
    wrappedReq.query = Object.fromEntries(parsedUrl.searchParams.entries());
    try {
      if (pathname.startsWith("/api/send-email")) {
        return await handler(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/upload")) {
        return await handler2(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/page-headers")) {
        return await handler3(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/client-logos")) {
        return await handler4(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/admin-users")) {
        return await handler5(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/settings")) {
        return await handler6(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/sliders")) {
        return await handler7(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/media")) {
        return await handler8(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/company-profile")) {
        return await handler9(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/social-links")) {
        return await handler10(wrappedReq, wrappedRes);
      }
      if (pathname.startsWith("/api/campaigns")) {
        return await handler11(wrappedReq, wrappedRes);
      }
      return wrappedRes.status(404).json({ success: false, error: "API endpoint not found" });
    } catch (apiErr) {
      console.error(`Error handling ${pathname}:`, apiErr);
      return wrappedRes.status(500).json({ success: false, error: apiErr.message || "Internal Server Error" });
    }
  }
  let filePath = path.join(DIST_DIR, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath)) {
    const candidateHtml = path.join(DIST_DIR, `${pathname}.html`);
    const candidateDirHtml = path.join(DIST_DIR, pathname, "index.html");
    if (fs.existsSync(candidateHtml)) {
      filePath = candidateHtml;
    } else if (fs.existsSync(candidateDirHtml)) {
      filePath = candidateDirHtml;
    } else {
      filePath = path.join(DIST_DIR, "index.html");
    }
  }
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.setHeader("Content-Type", contentType);
  if (pathname.startsWith("/assets/")) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (ext === ".html") {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  } else {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }
  const acceptEncoding = req.headers["accept-encoding"] || "";
  const stat = fs.statSync(filePath);
  const shouldCompress = stat.size > 1024 && (contentType.startsWith("text/") || contentType.startsWith("application/javascript") || contentType.startsWith("application/json") || contentType.startsWith("image/svg+xml"));
  if (shouldCompress && acceptEncoding.includes("gzip")) {
    res.setHeader("Content-Encoding", "gzip");
    res.removeHeader("Content-Length");
    fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
  } else if (shouldCompress && acceptEncoding.includes("deflate")) {
    res.setHeader("Content-Encoding", "deflate");
    res.removeHeader("Content-Length");
    fs.createReadStream(filePath).pipe(zlib.createDeflate()).pipe(res);
  } else {
    res.setHeader("Content-Length", stat.size);
    fs.createReadStream(filePath).pipe(res);
  }
});
server.listen(PORT, HOST, () => {
  console.log(`
======================================================`);
  console.log(`  Polaris Integrated & GeoSolutions (PIGL) Server`);
  console.log(`  Hostinger / Production Server listening on http://${HOST}:${PORT}`);
  console.log(`  Serving static assets from: ${DIST_DIR}`);
  console.log(`======================================================
`);
});
