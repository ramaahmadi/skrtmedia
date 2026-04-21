'use client';

import React from 'react';

interface ExportFormatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFormatSelect: (format: 'excel' | 'pdf' | 'text') => void;
}

export default function ExportFormatDialog({ isOpen, onClose, onFormatSelect }: ExportFormatDialogProps) {
  if (!isOpen) return null;

  const handleFormatSelect = (format: 'excel' | 'pdf' | 'text') => {
    onFormatSelect(format);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Pilih Format Export
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Pilih format untuk mengekspor data:
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => handleFormatSelect('excel')}
            className="w-full flex items-center gap-4 rounded-lg border border-gray-300 px-4 py-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <span className="text-3xl">📊</span>
            <div>
              <p className="font-medium text-dark dark:text-white">Excel (.xlsx)</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Format spreadsheet yang dapat diedit</p>
            </div>
          </button>
          
          <button
            onClick={() => handleFormatSelect('pdf')}
            className="w-full flex items-center gap-4 rounded-lg border border-gray-300 px-4 py-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <span className="text-3xl">📕</span>
            <div>
              <p className="font-medium text-dark dark:text-white">PDF (.pdf)</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Format dokumen yang dapat dicetak</p>
            </div>
          </button>
          
          <button
            onClick={() => handleFormatSelect('text')}
            className="w-full flex items-center gap-4 rounded-lg border border-gray-300 px-4 py-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-dark dark:text-white">Text/Note (.txt)</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Format teks sederhana</p>
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
