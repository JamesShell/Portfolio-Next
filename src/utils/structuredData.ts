// Structured data schemas for SEO

import { socialLinks } from "@/constants";

export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ettouzany",
  "jobTitle": "Full Stack Developer",
  "description": "Experienced Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies",
  "url": "https://etza.dev", // Update with your actual domain
  "sameAs": [
    socialLinks.github.link, // Update with your GitHub
    socialLinks.linkedin.link, // Update with your LinkedIn
    socialLinks.twitter.link // Update with your Twitter
  ],
  "knowsAbout": [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Full Stack Development",
    "UI/UX Design",
    "Web Development"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance"
  }
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ettouzany Portfolio",
  "description": "Portfolio website showcasing full stack development projects and skills",
  "url": "https://etza.dev", // Update with your actual domain
  "author": {
    "@type": "Person",
    "name": "Ettouzany"
  },
  "inLanguage": "en-US",
  "copyrightYear": new Date().getFullYear(),
  "genre": "Portfolio"
};

export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Ettouzany Portfolio",
  "description": "A collection of web development projects showcasing modern technologies and design principles",
  "author": {
    "@type": "Person",
    "name": "Ettouzany",
    "jobTitle": "Full Stack Developer"
  },
  "dateCreated": "2025-08-02", // Update with your actual creation date
  "dateModified": new Date().toISOString().split('T')[0],
  "inLanguage": "en-US",
  "keywords": "portfolio, web development, react, next.js, typescript, full stack"
};

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Ettouzany - Full Stack Developer",
  "description": "Professional web development services specializing in modern JavaScript frameworks and full stack solutions",
  "url": "https://etza.dev", // Update with your actual domain
  "founder": {
    "@type": "Person",
    "name": "Ettouzany"
  },
  "serviceType": "Web Development",
  "areaServed": "Worldwide",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Landing Page",
          "description": "A high-converting, launch-ready landing page designed and built fast."
        },
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": 1999,
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Premium Page",
          "description": "A premium, conversion-focused page with advanced polish and integrations."
        },
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": 2999,
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Product Partnership Retainer",
          "description": "Ongoing design + development support to ship improvements every month."
        },
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": 1499,
          "priceCurrency": "USD",
          "unitText": "MONTH"
        }
      }
    ]
  }
};

// Function to generate project structured data
export const generateProjectStructuredData = (project: {
  name: string;
  description: string;
  url?: string;
  image?: string;
  technologies: string[];
  dateCreated?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": project.name,
  "description": project.description,
  "url": project.url,
  "image": project.image,
  "author": {
    "@type": "Person",
    "name": "Ettouzany"
  },
  "programmingLanguage": project.technologies,
  "dateCreated": project.dateCreated,
  "operatingSystem": "Web Browser",
  "applicationCategory": "WebApplication"
});