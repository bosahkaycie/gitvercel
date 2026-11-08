-- ==============================================================================
-- POLARIS INTEGRATED & GEOSOLUTIONS LIMITED (PIGL)
-- CAMPAIGN & ENGAGEMENT MANAGER SCHEMA MIGRATION
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'Conference',
    event_name VARCHAR(255) NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_start_date DATE,
    event_end_date DATE,
    campaign_start_date DATE,
    campaign_closing_date DATE,
    cover_image_url TEXT,
    logo_image_url TEXT,
    assigned_form_id TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'closed', 'archived')),
    public_visibility BOOLEAN NOT NULL DEFAULT true,
    assigned_staff JSONB DEFAULT '[]'::jsonb,
    introduction_text TEXT,
    confirmation_message TEXT,
    terms_and_privacy_text TEXT,
    created_by VARCHAR(255) DEFAULT 'admin@polarisigl.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);

-- 2. CAMPAIGN FORMS TABLE
CREATE TABLE IF NOT EXISTS campaign_forms (
    id TEXT PRIMARY KEY,
    campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    active_version INT NOT NULL DEFAULT 1,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaign_forms_campaign_id ON campaign_forms(campaign_id);

-- 3. CAMPAIGN SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS campaign_submissions (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    campaign_slug VARCHAR(150),
    form_id TEXT,
    form_version_id TEXT,
    source VARCHAR(50) NOT NULL DEFAULT 'direct_link' CHECK (source IN ('qr_code', 'direct_link', 'booth_capture')),
    visitor_name VARCHAR(255) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(100),
    visitor_company VARCHAR(255),
    visitor_job_title VARCHAR(255),
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    assigned_staff VARCHAR(255),
    follow_up_status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (follow_up_status IN ('new', 'contacted', 'in_discussion', 'converted', 'closed')),
    notes JSONB DEFAULT '[]'::jsonb,
    consent_given BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaign_submissions_campaign_id ON campaign_submissions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_source ON campaign_submissions(source);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_status ON campaign_submissions(follow_up_status);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_created_at ON campaign_submissions(created_at);

-- 4. CAMPAIGN EMAIL TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS campaign_email_templates (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    template_type VARCHAR(50) NOT NULL DEFAULT 'visitor_acknowledgement',
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    reply_to VARCHAR(255),
    subject VARCHAR(300) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    enabled BOOLEAN NOT NULL DEFAULT true,
    internal_recipients JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaign_email_templates_campaign ON campaign_email_templates(campaign_id);

-- 5. CAMPAIGN EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS campaign_email_logs (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    submission_id TEXT,
    recipient VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    subject VARCHAR(300) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'queued')),
    attempts INT NOT NULL DEFAULT 1,
    error_details TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaign_email_logs_campaign ON campaign_email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_email_logs_status ON campaign_email_logs(status);

-- 6. ROW LEVEL SECURITY POLICIES
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_email_logs ENABLE ROW LEVEL SECURITY;

-- Public can view active campaigns and forms
DROP POLICY IF EXISTS "Public can view active campaigns" ON campaigns;
CREATE POLICY "Public can view active campaigns" ON campaigns 
    FOR SELECT USING (status IN ('active', 'scheduled', 'paused', 'closed') AND public_visibility = true);

DROP POLICY IF EXISTS "Public can submit to active campaigns" ON campaign_submissions;
CREATE POLICY "Public can submit to active campaigns" ON campaign_submissions 
    FOR INSERT WITH CHECK (true);

-- Authenticated admins can manage all campaign records
DROP POLICY IF EXISTS "Admins have full access to campaigns" ON campaigns;
CREATE POLICY "Admins have full access to campaigns" ON campaigns FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins have full access to forms" ON campaign_forms;
CREATE POLICY "Admins have full access to forms" ON campaign_forms FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins have full access to submissions" ON campaign_submissions;
CREATE POLICY "Admins have full access to submissions" ON campaign_submissions FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins have full access to email templates" ON campaign_email_templates;
CREATE POLICY "Admins have full access to email templates" ON campaign_email_templates FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins have full access to email logs" ON campaign_email_logs;
CREATE POLICY "Admins have full access to email logs" ON campaign_email_logs FOR ALL TO authenticated USING (true);
