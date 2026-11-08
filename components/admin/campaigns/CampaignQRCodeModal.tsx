import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Campaign } from '../../../types/campaign';
import { IconX, IconCheck, IconExternal } from '../AdminIcons';

interface CampaignQRCodeModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export const CampaignQRCodeModal: React.FC<CampaignQRCodeModalProps> = ({ campaign, isOpen, onClose }) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Construct absolute URL (production fallback to polarisigl.com)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://polarisigl.com';
  const campaignUrl = `${origin}/campaigns/${campaign.slug}`;

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    // Generate High-Res PNG (1024x1024)
    QRCode.toDataURL(campaignUrl, {
      width: 1024,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => {
        if (isMounted) setDataUrl(url);
      })
      .catch(console.error);

    // Generate Scalable Vector Graphic (SVG)
    QRCode.toString(campaignUrl, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(svg => {
        if (isMounted) {
          setSvgString(svg);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, campaignUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `PIGL_QR_${campaign.slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PIGL_QR_${campaign.slug}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Campaign QR Code</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{campaign.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Canvas Frame */}
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/20 shadow-md relative group">
            {loading ? (
              <div className="w-56 h-56 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : dataUrl ? (
              <div className="relative">
                <img
                  src={dataUrl}
                  alt={`QR Code for ${campaign.name}`}
                  className="w-56 h-56 object-contain block rounded-lg"
                />
                {/* Centered Brand Tag */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-md border border-slate-200 text-[10px] font-black text-emerald-800 tracking-wider">
                  PIGL
                </div>
              </div>
            ) : null}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Scan to Open Dedicated Lead Form
          </p>

          {/* Campaign Public URL box */}
          <div className="mt-3 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex items-center justify-between gap-2 text-left">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
              {campaignUrl}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-xs font-medium rounded text-slate-700 dark:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              {copied ? <IconCheck className="w-3.5 h-3.5 text-emerald-500" /> : null}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={downloadPng}
            disabled={!dataUrl}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            Download High-Res PNG
          </button>
          <button
            onClick={downloadSvg}
            disabled={!svgString}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            Download Vector SVG
          </button>
          <a
            href={`/campaigns/${campaign.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-600 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center"
            title="Open Public Form in New Tab"
          >
            <IconExternal className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
