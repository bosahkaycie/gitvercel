import React, { useState, useRef } from 'react';
import { useCompanyProfile } from '../../hooks/useSupabaseData';
import {
  IconFileCheck,
  IconDownload,
  IconUpload,
  IconTrash,
  IconEye,
  IconCheck,
  IconAlert,
  IconGlobe,
  IconExternal,
  IconShield,
  IconEdit,
  IconClose
} from '../../components/admin/AdminIcons';

interface AdminCompanyProfileProps {
  theme?: 'light' | 'dark';
  adminEmail?: string;
}

export const AdminCompanyProfile: React.FC<AdminCompanyProfileProps> = ({
  theme = 'light',
  adminEmail = 'admin@polarisigl.com'
}) => {
  const isDark = theme === 'dark';
  const {
    document: doc,
    loading,
    error: hookError,
    uploadProfileDocument,
    togglePublish,
    removeProfileDocument,
    saveProfileMetadata,
    reload
  } = useCompanyProfile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<{
    name: string;
    size: string;
    sizeBytes: number;
    type: string;
  } | null>(null);

  const [editTitle, setEditTitle] = useState<string>('');
  const [editVersion, setEditVersion] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [isEditingMetadata, setIsEditingMetadata] = useState<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(prev => (prev?.text === text ? null : prev));
    }, 6000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    // 1. Validate extension and MIME type
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      showNotification('error', 'Invalid file format. Only official PDF (.pdf) documents are accepted for the Company Profile.');
      return;
    }

    // 2. Validate file size (max 50MB)
    const maxBytes = 50 * 1024 * 1024;
    if (file.size > maxBytes) {
      showNotification('error', `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 50MB maximum permitted limit.`);
      return;
    }

    setSelectedFile(file);
    setSelectedFilePreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      sizeBytes: file.size,
      type: 'PDF Document (application/pdf)'
    });

    if (!editTitle) {
      setEditTitle(doc?.title || 'Polaris Integrated & GeoSolutions Limited - Official Corporate Profile');
    }
    if (!editVersion) {
      setEditVersion(doc?.version || '2026.1');
    }
  };

  const handleUploadCommit = async (publishImmediately: boolean) => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await uploadProfileDocument(
        selectedFile,
        {
          title: editTitle.trim() || doc?.title,
          version: editVersion.trim() || doc?.version,
          description: editDescription.trim() || doc?.description,
          publishNow: publishImmediately
        },
        adminEmail
      );

      setSelectedFile(null);
      setSelectedFilePreview(null);
      showNotification(
        'success',
        publishImmediately
          ? 'Company Profile successfully uploaded and published live across the website!'
          : 'Company Profile uploaded as draft. Click Publish when ready to make it public.'
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to upload Company Profile document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!doc?.file_url) {
      showNotification('error', 'Cannot publish: No document file has been uploaded yet. Please upload a PDF first.');
      return;
    }

    const nextState = !doc.is_published;
    try {
      await togglePublish(nextState, adminEmail);
      showNotification(
        'success',
        nextState
          ? 'Company Profile published! Visitors can now download the PDF from the website.'
          : 'Company Profile unpublished. Download links are now hidden from public visitors.'
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update publication status.');
    }
  };

  const handleRemoveDocument = async () => {
    try {
      await removeProfileDocument(adminEmail);
      setIsConfirmingDelete(false);
      showNotification('success', 'Company Profile removed. The public download links have been disabled.');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to remove Company Profile.');
    }
  };

  const handleSaveMetadata = async () => {
    try {
      await saveProfileMetadata(
        {
          title: editTitle.trim() || doc?.title,
          version: editVersion.trim() || doc?.version,
          description: editDescription.trim() || doc?.description
        },
        adminEmail
      );
      setIsEditingMetadata(false);
      showNotification('success', 'Document metadata updated successfully.');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update metadata.');
    }
  };

  const hasActiveDocument = Boolean(doc?.file_url && doc?.filename);
  const isPublished = Boolean(hasActiveDocument && doc?.is_published);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
            <span>Website Content</span>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Company Profile</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <IconFileCheck className="w-6 h-6 text-emerald-600" />
            <span>Company Profile Document Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Upload, publish, replace, and audit PIGL's official corporate presentation PDF document. Public visitors download this document directly through header and footer links.
          </p>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center space-x-3 shrink-0">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-2 border shadow-sm ${
              isPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : hasActiveDocument
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPublished
                  ? 'bg-emerald-500 animate-pulse'
                  : hasActiveDocument
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span>
              {isPublished
                ? 'Live & Published Online'
                : hasActiveDocument
                ? 'Draft (Hidden from Public)'
                : 'No Document Uploaded'}
            </span>
          </div>

          <button
            onClick={() => reload()}
            title="Refresh from server"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {statusMessage.type === 'success' ? (
              <IconCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <IconAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Document Overview & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Document Details & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Active Document */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 font-bold">
                  PDF
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Current Active Document
                  </h2>
                  <p className="text-xs text-slate-500">
                    {hasActiveDocument ? 'Persistent document record in database & storage' : 'No document currently published'}
                  </p>
                </div>
              </div>

              {hasActiveDocument && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleTogglePublish}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      doc?.is_published
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span>{doc?.is_published ? 'Unpublish Document' : 'Publish Document'}</span>
                  </button>
                </div>
              )}
            </div>

            {hasActiveDocument ? (
              <div className="space-y-4">
                {/* Document Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Document Title
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                      {doc?.title}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Original File Name
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                      {doc?.filename}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      File Size & Format
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                      {doc?.formatted_size || `${(doc?.file_size / (1024 * 1024)).toFixed(2)} MB`} • PDF Document
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Version / Release
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {doc?.version || '2026.1'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Last Updated
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">
                      {doc?.updated_at ? new Date(doc.updated_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Responsible Administrator
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 mt-0.5 block truncate">
                      {doc?.updated_by || 'admin@polarisigl.com'}
                    </span>
                  </div>
                </div>

                {/* Description / Summary */}
                {doc?.description && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Document Description & Scope
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {doc.description}
                    </p>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={doc?.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-sm"
                  >
                    <IconDownload className="w-4 h-4" />
                    <span>Download / View Active PDF</span>
                  </a>

                  <button
                    onClick={() => {
                      setEditTitle(doc?.title || '');
                      setEditVersion(doc?.version || '');
                      setEditDescription(doc?.description || '');
                      setIsEditingMetadata(!isEditingMetadata);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
                  >
                    <IconEdit className="w-3.5 h-3.5" />
                    <span>{isEditingMetadata ? 'Cancel Edit' : 'Edit Metadata'}</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                  >
                    <IconUpload className="w-3.5 h-3.5" />
                    <span>Replace PDF File</span>
                  </button>

                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40 text-xs font-bold transition-all ml-auto"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                    <span>Remove Document</span>
                  </button>
                </div>

                {/* Inline Metadata Editor */}
                {isEditingMetadata && (
                  <div className="mt-4 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 space-y-3 animate-fade-in text-xs">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      Edit Document Metadata
                    </h3>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Document Display Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Version Tag
                        </label>
                        <input
                          type="text"
                          value={editVersion}
                          onChange={(e) => setEditVersion(e.target.value)}
                          placeholder="e.g. 2026.1"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Scope & Highlights Description
                      </label>
                      <textarea
                        rows={2}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={handleSaveMetadata}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Save Metadata Changes
                      </button>
                      <button
                        onClick={() => setIsEditingMetadata(false)}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <IconFileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Published Company Profile
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload an official corporate profile document below to make it available for public download across the website.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <IconUpload className="w-4 h-4" />
                  <span>Upload Company Profile PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Card: Upload New or Replacement Document */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <IconUpload className="w-4 h-4 text-emerald-600" />
                <span>Upload New / Replacement Document</span>
              </h2>
              <p className="text-xs text-slate-500">
                Safe replacement workflow: the existing published document remains live until the new PDF is successfully verified and saved.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                <IconUpload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Click to browse or drag and drop your PDF here
              </p>
              <p className="text-xs text-slate-500">
                Supported format: <strong className="text-slate-700 dark:text-slate-300">PDF (.pdf)</strong> only • Maximum file size: <strong className="text-slate-700 dark:text-slate-300">50 MB</strong>
              </p>
            </div>

            {/* Selected File Pre-Publish Staging Area */}
            {selectedFilePreview && (
              <div className="mt-5 p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      NEW
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block">
                        File Staged for Upload
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white font-mono truncate max-w-md">
                        {selectedFilePreview.name}
                      </h4>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {selectedFilePreview.size} • {selectedFilePreview.type}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setSelectedFilePreview(null);
                    }}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                    title="Cancel selection"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="e.g. Polaris Integrated & GeoSolutions - Corporate Profile"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Version Label
                    </label>
                    <input
                      type="text"
                      value={editVersion}
                      onChange={(e) => setEditVersion(e.target.value)}
                      placeholder="e.g. 2026.1"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Upload & Publish Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    disabled={isUploading}
                    onClick={() => handleUploadCommit(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Uploading & Publishing...</span>
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-4 h-4" />
                        <span>Upload & Publish Immediately</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={isUploading}
                    onClick={() => handleUploadCommit(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all disabled:opacity-60"
                  >
                    Upload as Draft (Do Not Publish Yet)
                  </button>

                  <button
                    disabled={isUploading}
                    onClick={() => {
                      setSelectedFile(null);
                      setSelectedFilePreview(null);
                    }}
                    className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Preview & Public Integration Card */}
        <div className="space-y-6">
          {/* Card: Document Cover Preview */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
              <IconEye className="w-4 h-4 text-emerald-600" />
              <span>Public Presentation Preview</span>
            </h3>

            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group flex items-center justify-center shadow-inner">
              <img
                src={doc?.cover_image_url || '/assets/PIGL COMPANY PROFILE.jpg'}
                alt="PIGL Company Profile Cover"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Official Presentation
                </span>
                <span className="text-white text-xs font-bold truncate">
                  {doc?.title}
                </span>
                <span className="text-slate-300 text-[10px] font-mono">
                  {doc?.version ? `Edition ${doc.version}` : 'Latest Edition'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Storage Bucket:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{doc?.storage_bucket || 'documents'}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Access:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">Public CDN</span>
              </div>
            </div>
          </div>

          {/* Card: Public Website Integration Map */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
              <IconGlobe className="w-4 h-4 text-emerald-600" />
              <span>Public Website Integration</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              All website download buttons automatically sync to this active document.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Desktop Header Icon</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPublished ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isPublished ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Mobile Menu Button</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPublished ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isPublished ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Footer Download Button</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPublished ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isPublished ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Confirmation Modal</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPublished ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isPublished ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <IconTrash className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Remove Published Company Profile?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                This will unpublish and clear the active company profile from public website downloads. The download links in the header and footer will be safely hidden.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveDocument}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanyProfile;
