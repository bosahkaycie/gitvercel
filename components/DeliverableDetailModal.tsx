import React, { useEffect } from 'react';
import { ServiceDeliverableItem } from '../types';

interface DeliverableDetailModalProps {
  deliverable: ServiceDeliverableItem | null;
  serviceTitle: string;
  division?: string;
  onClose: () => void;
  onInquire?: (title: string) => void;
}

const DeliverableDetailModal: React.FC<DeliverableDetailModalProps> = ({
  deliverable,
  serviceTitle,
  division = 'Specialist Engineering',
  onClose,
  onInquire
}) => {
  useEffect(() => {
    if (!deliverable) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deliverable, onClose]);

  if (!deliverable) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-none overflow-hidden max-h-[92vh] flex flex-col hover-lift"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-7 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="space-y-1 pr-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-emerald-700 uppercase">
              <span>{serviceTitle}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-semibold">{division}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {deliverable.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded-none transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-5 sm:space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          {/* Main Technical Scope & Description */}
          <div>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-none"></span>
              <span>Technical Scope & Methodology</span>
            </h4>
            <p className="text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-3.5 sm:p-4 border border-slate-100 text-xs sm:text-sm">
              {deliverable.description}
            </p>
          </div>

          {/* Standard Engineering Deliverables Output */}
          {deliverable.deliverablesOutput && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-none"></span>
                <span>Deliverable Output & Documentation</span>
              </h4>
              <div className="bg-slate-50 p-3.5 sm:p-4 border border-slate-200/80 flex items-start space-x-3">
                <span className="text-emerald-700 font-bold text-base mt-0.5">📋</span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {deliverable.deliverablesOutput}
                </p>
              </div>
            </div>
          )}

          {/* Applicable Engineering Standards */}
          {deliverable.standards && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-none"></span>
                <span>Applicable Standards & Compliance</span>
              </h4>
              <div className="bg-emerald-50/60 p-3 sm:p-3.5 border border-emerald-100 flex items-center space-x-2.5 text-xs text-emerald-950 font-semibold">
                <span className="text-emerald-700 font-black">✓</span>
                <span>{deliverable.standards}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal">
            Conforms to NUPRC & ISO 9001:2015 QA protocols.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-white transition-colors text-center"
            >
              Close
            </button>
            {onInquire && (
              <button
                type="button"
                onClick={() => {
                  onInquire(deliverable.title);
                  onClose();
                }}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white hover:bg-emerald-800 transition-colors inline-flex items-center justify-center space-x-1.5 shadow-sm text-center"
              >
                <span>Scope Deliverable</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverableDetailModal;
