'use client';

import { useState } from 'react';
import { FaWhatsapp, FaLink, FaCheck } from 'react-icons/fa';

interface ShareButtonsProps {
  title: string;
  description?: string;
  path?: string;
}

export default function ShareButtons({
  title,
  description,
  path,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    if (path) {
      return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
    }
    return window.location.href;
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const text = [
      `*${title}*`,
      description ? `\n${description}` : '',
      `\nSelengkapnya: ${url}`,
    ]
      .filter(Boolean)
      .join('');
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700"
      >
        <FaWhatsapp className="h-4 w-4" />
        <span>Bagikan ke WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-gray-200 dark:hover:border-primary/50 dark:hover:text-white"
      >
        {copied ? (
          <>
            <FaCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Link Tersalin!</span>
          </>
        ) : (
          <>
            <FaLink className="h-3.5 w-3.5" />
            <span>Salin Link</span>
          </>
        )}
      </button>
    </div>
  );
}
