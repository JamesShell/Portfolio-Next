import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonicalUrl?: string;
  structuredData?: object;
}

const defaultMeta = {
  title: 'Ettouzany Portfolio - Full Stack Developer & UI/UX Designer',
  description: 'Portfolio of Ettouzany - Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies. Explore my projects, skills, and experience.',
  keywords: 'full stack developer, react developer, next.js, typescript, web development, portfolio, UI/UX design, frontend, backend',
  ogImage: '/og-image.jpg',
  siteUrl: 'https://etza.dev' // Update with your actual domain
};

export default function SEOHead({
  title = defaultMeta.title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  ogImage = defaultMeta.ogImage,
  ogType = 'website',
  canonicalUrl,
  structuredData
}: SEOHeadProps) {
  const router = useRouter();
  const currentUrl = `${defaultMeta.siteUrl}${router.asPath}`;
  const fullTitle = title === defaultMeta.title ? title : `${title} | Ettouzany Portfolio`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ettouzany" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || currentUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${defaultMeta.siteUrl}${ogImage}`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Ettouzany Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${defaultMeta.siteUrl}${ogImage}`} />
      <meta name="twitter:creator" content="@yourhandle" /> {/* Update with your Twitter handle */}

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  );
}