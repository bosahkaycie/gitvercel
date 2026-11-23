#!/usr/bin/env node
/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Automated Migration Script: Supabase Candidate CVs -> Hostinger Server Storage
 * 
 * Transfers all submitted candidate CVs and cover letter files from Supabase Storage
 * to Hostinger native server disk at polarisigl.com/assets/uploads/resumes/
 * and updates the database records with the new Hostinger URLs.
 */

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jbldpfvceacfonkzzhig.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('Missing Supabase API key in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const HOSTINGER_SSH = 'ssh -p 65002 u858426488@153.92.9.146';
const REMOTE_RESUMES_DIR = 'domains/polarisigl.com/public_html/assets/uploads/resumes';
const BASE_HOSTINGER_URL = 'https://polarisigl.com/assets/uploads/resumes';

async function ensureRemoteDir() {
  console.log('Ensuring remote target directory exists on Hostinger...');
  try {
    execSync(`${HOSTINGER_SSH} "mkdir -p ${REMOTE_RESUMES_DIR} && chmod 755 ${REMOTE_RESUMES_DIR}"`, { stdio: 'inherit' });
    console.log('✓ Remote directory ready:', REMOTE_RESUMES_DIR);
  } catch (err) {
    console.error('Failed to create remote directory:', err);
    throw err;
  }
}

async function uploadFileToHostinger(localPath, remoteFilename) {
  const remotePath = `${REMOTE_RESUMES_DIR}/${remoteFilename}`;
  execSync(`scp -P 65002 "${localPath}" u858426488@153.92.9.146:"${remotePath}"`, { stdio: 'ignore' });
  execSync(`${HOSTINGER_SSH} "chmod 644 '${remotePath}'"`, { stdio: 'ignore' });
  return `${BASE_HOSTINGER_URL}/${remoteFilename}`;
}

async function runMigration() {
  console.log('=== PIGL CV MIGRATION TO HOSTINGER ===');
  await ensureRemoteDir();

  const tempDir = path.join(process.cwd(), '.tmp_migration_resumes');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  console.log('\nFetching all job applications from database...');
  const { data: applications, error: fetchErr } = await supabase
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (fetchErr) {
    console.error('Failed to fetch job applications from Supabase:', fetchErr);
    if (fetchErr.message?.includes('402') || fetchErr.message?.includes('quota')) {
      console.error('\nNOTE: Supabase is currently locked with HTTP 402 exceed_cached_egress_quota.');
      console.error('Please upgrade to Pro or switch off the Spend Cap in the Supabase Dashboard, then re-run this script.');
    }
    process.exit(1);
  }

  console.log(`Found ${applications.length} total applications.`);

  const needsMigration = applications.filter(app => {
    const hasSbResume = app.resume_url && app.resume_url.includes('supabase.co');
    const hasSbCoverLetter = app.cover_letter && app.cover_letter.includes('supabase.co');
    return hasSbResume || hasSbCoverLetter;
  });

  console.log(`Applications requiring file migration: ${needsMigration.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < needsMigration.length; i++) {
    const app = needsMigration[i];
    const candidateName = app.applicant_name || 'Candidate';
    console.log(`[${i + 1}/${needsMigration.length}] Processing: ${candidateName} (${app.job_title || 'General'})`);

    let updatedResumeUrl = app.resume_url;
    let updatedCoverLetter = app.cover_letter;
    let hasChanges = false;

    // 1. Process Resume URL
    if (app.resume_url && app.resume_url.includes('supabase.co')) {
      try {
        const urlObj = new URL(app.resume_url);
        const rawFileName = path.basename(urlObj.pathname);
        console.log(`  Downloading resume: ${rawFileName}...`);

        const response = await fetch(app.resume_url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length < 500) {
          throw new Error(`Downloaded file suspiciously small (${buffer.length} bytes)`);
        }

        const localFile = path.join(tempDir, rawFileName);
        fs.writeFileSync(localFile, buffer);

        console.log(`  Uploading to Hostinger (${(buffer.length / 1024).toFixed(1)} KB)...`);
        const hostingerUrl = await uploadFileToHostinger(localFile, rawFileName);
        updatedResumeUrl = hostingerUrl;
        hasChanges = true;
        console.log(`  ✓ Resume migrated: ${hostingerUrl}`);
      } catch (resumeErr) {
        console.warn(`  ✗ Failed to migrate resume for ${candidateName}:`, resumeErr.message);
      }
    }

    // 2. Process Embedded Cover Letter URL
    if (app.cover_letter && app.cover_letter.includes('supabase.co')) {
      const match = app.cover_letter.match(/<!-- pigl_cover_letter_file:\s*(https?:\/\/[^\s>]+supabase\.co[^\s>]+)\s*-->/);
      if (match) {
        const clUrl = match[1];
        try {
          const rawClName = path.basename(new URL(clUrl).pathname);
          console.log(`  Downloading cover letter document: ${rawClName}...`);

          const response = await fetch(clUrl);
          if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer());
            const localFile = path.join(tempDir, rawClName);
            fs.writeFileSync(localFile, buffer);

            const hostingerClUrl = await uploadFileToHostinger(localFile, rawClName);
            updatedCoverLetter = app.cover_letter.replace(clUrl, hostingerClUrl);
            hasChanges = true;
            console.log(`  ✓ Cover letter migrated: ${hostingerClUrl}`);
          }
        } catch (clErr) {
          console.warn(`  ✗ Failed to migrate cover letter for ${candidateName}:`, clErr.message);
        }
      }
    }

    // 3. Update Database Record if URLs changed
    if (hasChanges) {
      const { error: updateErr } = await supabase
        .from('job_applications')
        .update({
          resume_url: updatedResumeUrl,
          cover_letter: updatedCoverLetter
        })
        .eq('id', app.id);

      if (updateErr) {
        console.error(`  ✗ Failed to update database for ${app.id}:`, updateErr);
        failCount++;
      } else {
        console.log(`  ✓ Database updated successfully.`);
        successCount++;
      }
    } else {
      failCount++;
    }

    // Small delay to pace requests
    await new Promise(r => setTimeout(r, 200));
  }

  // Clean up temporary local directory
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {}

  console.log('\n=== MIGRATION SUMMARY ===');
  console.log(`Total needing migration: ${needsMigration.length}`);
  console.log(`Successfully migrated:   ${successCount}`);
  console.log(`Failed / Skipped:        ${failCount}`);
  console.log('=========================');
}

runMigration().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
