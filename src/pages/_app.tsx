import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense } from "react";
import { ThemeProvider } from '@/components/theme/theme-provider';
import Loading from "./_loading";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={<Loading />}>
        <Component {...pageProps} />
      </Suspense>
    </ThemeProvider>
  );
}
