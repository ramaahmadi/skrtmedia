'use client';

import React from 'react';
import { exportSingleItemToText, exportSingleItemToExcel, exportSingleItemToPDF } from '@/lib/exportToText';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  title: string;
  itemName: string;
  format: 'excel' | 'pdf' | 'text';
}

export default function ShareDialog({ isOpen, onClose, item, title, itemName, format }: ShareDialogProps) {
  if (!isOpen) return null;

  // Generate text content
  const generateTextContent = (): string => {
    let content = `${title.toUpperCase()}\n`;
    content += `${'='.repeat(50)}\n\n`;
    
    Object.keys(item).forEach(key => {
      const value = item[key];
      let formattedValue = value;
      
      if (value === null || value === undefined) {
        formattedValue = '-';
      } else if (typeof value === 'boolean') {
        formattedValue = value ? 'Ya' : 'Tidak';
      } else if (Array.isArray(value)) {
        formattedValue = value.length > 0 ? value.join(', ') : '-';
      } else if (typeof value === 'object') {
        formattedValue = JSON.stringify(value, null, 2);
      }
      
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      content += `${formattedKey}: ${formattedValue}\n`;
    });
    
    return content;
  };

  const getFormatLabel = (): string => {
    switch (format) {
      case 'excel': return 'Excel (.xlsx)';
      case 'pdf': return 'PDF (.pdf)';
      case 'text': return 'Text/Note (.txt)';
    }
  };

  const getFormatIcon = (): string => {
    switch (format) {
      case 'excel': return '📊';
      case 'pdf': return '📕';
      case 'text': return '📄';
    }
  };

  const handleDownload = () => {
    switch (format) {
      case 'excel':
        exportSingleItemToExcel(item, title, itemName);
        break;
      case 'pdf':
        exportSingleItemToPDF(item, title, itemName);
        break;
      case 'text':
        exportSingleItemToText(item, title, itemName);
        break;
    }
    onClose();
  };

  const handleCopyToClipboard = () => {
    const content = generateTextContent();
    navigator.clipboard.writeText(content).then(() => {
      alert('Teks berhasil disalin ke clipboard!');
      onClose();
    });
  };

  const handleShareWhatsApp = () => {
    const content = generateTextContent();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Bagikan {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Format: {getFormatLabel()}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <span className="text-2xl">{getFormatIcon()}</span>
            <div>
              <p className="font-medium text-dark dark:text-white">Download sebagai File</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Simpan sebagai file {getFormatLabel()}</p>
            </div>
          </button>
          
          <button
            onClick={handleCopyToClipboard}
            className="w-full flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-dark dark:text-white">Copy ke Clipboard</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Salin teks untuk dipaste</p>
            </div>
          </button>
          
          <button
            onClick={handleShareWhatsApp}
            className="w-full flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-medium text-dark dark:text-white">Share ke WhatsApp</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bagikan langsung ke WhatsApp</p>
            </div>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
