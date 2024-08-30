// app/providers.tsx
"use client";

import { SessionProvider } from 'next-auth/react';
import {NextUIProvider} from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
