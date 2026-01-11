import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/hooks/useAuth';
import Loading from "./_loading";
import { useRouter } from 'next/router';
import { GOOGLE_ANALYTICS_ID } from "@/constants";
import CookieBanner from "@/components/CookieBanner";
import { ContactModalProvider } from "@/context/ContactModalContext";
import { BookingModalProvider } from "@/context/BookingModalContext";
import ContactDialog from "@/components/fragments/ContactDialog";
import BookingDialog from "@/components/fragments/BookingDialog";
import { Toaster } from "sonner";

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
      <ContactModalProvider>
        <BookingModalProvider>
          {isAdminRoute ? (
            <AuthProvider>
              {AppContent}
            </AuthProvider>
          ) : (
            <>
              {AppContent}
              <ContactDialog />
              <BookingDialog />
            </>
          )}
          {GOOGLE_ANALYTICS_ID && <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />}
          <CookieBanner />
          <Toaster />
        </BookingModalProvider>
      </ContactModalProvider>
    </ThemeProvider>
  );
}
