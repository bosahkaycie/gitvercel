import JSZip from 'jszip';
import { JobApplication } from '../types';

export interface DownloadProgress {
  current: number;
  total: number;
  currentName: string;
  percent: number;
}

/**
 * Sanitizes strings for safe use as filenames across OS filesystems.
 */
function sanitizeFileName(str: string): string {
  return str
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .trim()
    .slice(0, 100);
}

/**
 * Downloads candidate CVs and packages them into a single ZIP archive.
 */
export async function downloadApplicationsZip({
  applications,
  zipTitle = 'PIGL_CVs',
  onProgress
}: {
  applications: JobApplication[];
  zipTitle?: string;
  onProgress?: (progress: DownloadProgress) => void;
}): Promise<{ success: boolean; downloadedCount: number; failedCount: number; zipName: string }> {
  const validApps = applications.filter(a => Boolean(a.resume_url));
  const total = validApps.length;

  if (total === 0) {
    throw new Error('No candidate applications with valid CV links were found to download.');
  }

  const zip = new JSZip();
  let completed = 0;
  let failed = 0;
  const manifestRows: string[] = [
    'POLARIS INTEGRATED & GEOSOLUTIONS LIMITED (PIGL)',
    `CANDIDATE CV ARCHIVE: ${zipTitle}`,
    `Generated on: ${new Date().toLocaleString('en-GB')}`,
    `Total Applicants: ${applications.length} | CVs Included: ${total}`,
    '='.repeat(80),
    ''
  ];

  const usedFileNames = new Set<string>();

  for (let i = 0; i < validApps.length; i++) {
    const app = validApps[i];
    const candidateName = sanitizeFileName(app.applicant_name || 'Candidate');
    const roleName = sanitizeFileName(app.job_title || 'General_Application');

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        currentName: app.applicant_name || `Applicant ${i + 1}`,
        percent: Math.round(((i + 1) / total) * 100)
      });
    }

    const resumeUrl = app.resume_url!;
    try {
      // Determine extension from URL or fallback to pdf
      let ext = 'pdf';
      const cleanUrl = resumeUrl.split('?')[0].split('#')[0];
      const matchExt = cleanUrl.match(/\.([a-zA-Z0-9]{3,4})$/);
      if (matchExt && matchExt[1]) {
        ext = matchExt[1].toLowerCase();
      }

      let baseFileName = `${roleName} - ${candidateName}_CV.${ext}`;
      let counter = 1;
      while (usedFileNames.has(baseFileName)) {
        counter++;
        baseFileName = `${roleName} - ${candidateName}_CV_${counter}.${ext}`;
      }
      usedFileNames.add(baseFileName);

      // Fetch file data
      const response = await fetch(resumeUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      zip.file(baseFileName, blob);
      completed++;

      manifestRows.push(
        `✓ [${app.status || 'New'}] ${app.applicant_name} | Role: ${app.job_title || 'General'} | File: ${baseFileName} | Email: ${app.applicant_email} | Phone: ${app.applicant_phone || 'N/A'}`
      );

      // If candidate also has a cover letter document file
      if (app.cover_letter_url) {
        try {
          let clExt = 'pdf';
          const clClean = app.cover_letter_url.split('?')[0].split('#')[0];
          const clMatch = clClean.match(/\.([a-zA-Z0-9]{3,4})$/);
          if (clMatch && clMatch[1]) clExt = clMatch[1].toLowerCase();
          const clFileName = `${roleName} - ${candidateName}_CoverLetter.${clExt}`;
          const clResp = await fetch(app.cover_letter_url, { mode: 'cors' });
          if (clResp.ok) {
            const clBlob = await clResp.blob();
            zip.file(clFileName, clBlob);
          }
        } catch {
          // Non-fatal if optional cover letter attachment fails
        }
      }
    } catch (err: any) {
      failed++;
      manifestRows.push(
        `✗ [FAILED] ${app.applicant_name} | Role: ${app.job_title} | Error: ${err?.message || 'Download error'} | URL: ${resumeUrl}`
      );
    }
  }

  manifestRows.push('');
  manifestRows.push('='.repeat(80));
  manifestRows.push(`Summary: ${completed} CV files successfully archived, ${failed} failed.`);
  zip.file('INDEX_MANIFEST.txt', manifestRows.join('\n'));

  // Generate ZIP file
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  const finalZipName = `${zipTitle}_${dateStr}.zip`;

  // Trigger browser download
  const blobUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = finalZipName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

  return {
    success: completed > 0,
    downloadedCount: completed,
    failedCount: failed,
    zipName: finalZipName
  };
}
