'use client';

import Link from 'next/link';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  actionLabel?: string;
  actionHref?: string;
  durationMs?: number;
}

interface ToastRecord extends ToastOptions {
  id: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const showToast = useCallback(
    ({ durationMs = 4000, ...toast }: ToastOptions) => {
      const id = generateId();
      const toastWithDefaults: ToastRecord = {
        id,
        type: toast.type ?? 'info',
        ...toast,
      };

      setToasts(prev => [...prev, toastWithDefaults]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, durationMs);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`min-w-[260px] rounded-lg border px-4 py-3 shadow-elevation-md bg-background text-sm ${
              toast.type === 'success'
                ? 'border-green-200 text-green-800'
                : toast.type === 'error'
                  ? 'border-red-200 text-red-800'
                  : 'border-slate-200 text-slate-800'
            }`}
          >
            <p className="font-medium">{toast.message}</p>
            {/* {toast.actionHref && toast.actionLabel && (
              <Link
                href={toast.actionHref}
                className="mt-2 inline-flex items-center text-xs font-semibold text-primary hover:underline"
              >
                {toast.actionLabel}
              </Link>
            )} */}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

