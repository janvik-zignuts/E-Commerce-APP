'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@/componnets/ui/toastProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

