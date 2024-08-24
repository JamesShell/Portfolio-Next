import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense } from "react";
import Loading from "./_loading";

export default function App({ Component, pageProps }: AppProps) {
  return <Suspense fallback={<Loading />}>
  <Component {...pageProps} />
</Suspense>;
}
