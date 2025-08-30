import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense } from "react";
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/hooks/useAuth';
import Loading from "./_loading";
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  const AppContent = (
    <Suspense fallback={<Loading />}>
      <Component {...pageProps} />
    </Suspense>
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {isAdminRoute ? (
        <AuthProvider>
          {AppContent}
        </AuthProvider>
      ) : (
        AppContent
      )}
    </ThemeProvider>
  );
}
