'use client';

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

type Toast = { id: string; type: 'success' | 'error'; message: string };
type ToastContextType = { success: (message: string) => void; error: (message: string) => void };

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: Toast['type'], message: string) => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const api = useMemo<ToastContextType>(
    () => ({ success: (m) => push('success', m), error: (m) => push('error', m) }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex pointer-events-none">
        <div className="flex w-full max-w-md flex-col gap-2 items-end">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-lg border px-4 py-2 text-sm shadow-lg transition-all duration-200 ${
                t.type === 'success'
                  ? 'border-green-700 bg-green-900/70 text-green-100'
                  : 'border-red-700 bg-red-900/70 text-red-100'
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within <ToastProvider />');
  return context;
}
