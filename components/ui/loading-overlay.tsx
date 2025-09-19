'use client';

import { createPortal } from 'react-dom';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message }: LoadingOverlayProps) {
  if (!isVisible || typeof window === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white border border-gray-700">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        {message && <span>{message}</span>}
      </div>
    </div>,
    document.body,
  );
}
