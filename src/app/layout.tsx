import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import StarField from "@/components/shared/StarField";
import SocialFloat from "@/components/social/SocialFloat";
import Script from "next/script";


// 1. Google Font Preloads
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// 2. Viewport Configuration
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// 3. Dynamic Metadata API (Preserves all search index placements)
export const metadata: Metadata = {
  title: {
    default: "Saumyadeep Chakraborty | TechySaumya | Full Stack Developer",
    template: "%s | TechySaumya",
  },
  description:
    "Full stack developer, photographer, and software engineer from West Bengal building premium digital experiences, scalable systems, AI solutions, and cinematic web products.",
  keywords: [
    "TechySaumya",
    "Saumyadeep Chakraborty",
    "Saumyadeep",
    "Saumya",
    "Bapu",
    "Bapuji",
    "Saumyadeep Dev",
    "Saumya.dev",
    "full stack developer",
    "backend engineer",
    "photographer",
    "portfolio",
    "Cooch Behar",
    "West Bengal",
    "react developer",
    "next.js developer",
  ],
  authors: [{ name: "Saumyadeep Chakraborty" }],
  creator: "Saumyadeep Chakraborty",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://saumyadeepch.vercel.app"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "googledc56d21eedf0c659.html",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://saumyadeepch.vercel.app",
    title: "Saumyadeep Chakraborty | TechySaumya | Full Stack Developer",
    description:
      "Official portfolio of Saumyadeep Chakraborty (TechySaumya) showcasing high-performance backend systems, AI agents, photography, and motorcycle touring.",
    siteName: "TechySaumya",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "Saumyadeep Chakraborty portrait also known as TechySaumya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saumyadeep Chakraborty | TechySaumya",
    description:
      "Backend systems, AI architectures, photography, and motorcycle touring logs.",
    images: ["/preview-image.png"],
  },
};

// 4. Enhanced Structured Data Graph (JSON-LD)
const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://saumyadeepch.vercel.app/#person",
      "name": "Saumyadeep Chakraborty",
      "alternateName": [
        "Saumyadeep",
        "Saumya",
        "TechySaumya",
        "Bapu",
        "Bapuji",
        "Saumyadeep Dev",
        "Saumya.dev",
      ],
      "url": "https://saumyadeepch.vercel.app/",
      "image": "https://saumyadeepch.vercel.app/saumyadeep-chakraborty-techysaumya-portrait.jpg",
      "jobTitle": ["Full Stack Developer", "Backend Engineer", "Photographer"],
      "description":
        "Saumyadeep Chakraborty is an Indian full stack developer, backend engineer, photographer, and motorcycle touring enthusiast known online as TechySaumya.",
      "nationality": {
        "@type": "Country",
        "name": "India",
      },
      "knowsAbout": [
        "Full Stack Development",
        "Backend Engineering",
        "React",
        "Next.js",
        "API Engineering",
        "Database Architecture",
        "Artificial Intelligence",
        "Photography",
        "Motorcycle Touring",
      ],
      "sameAs": [
        "https://github.com/SoumaCh03",
        "https://www.linkedin.com/in/saumyadeep-c-34342a177/",
        "https://snappysaumya.vercel.app",
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cooch Behar",
        "addressRegion": "West Bengal",
        "addressCountry": "India",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://saumyadeepch.vercel.app/#website",
      "url": "https://saumyadeepch.vercel.app/",
      "name": "TechySaumya",
      "publisher": {
        "@id": "https://saumyadeepch.vercel.app/#person",
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://saumyadeepch.vercel.app/blog?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "https://saumyadeepch.vercel.app/#profilepage",
      "mainEntity": {
        "@id": "https://saumyadeepch.vercel.app/#person",
      },
      "headline": "Saumyadeep Chakraborty | TechySaumya",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saumyadeepch.vercel.app/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://saumyadeepch.vercel.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Photography",
          "item": "https://saumyadeepch.vercel.app/photography"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Journey",
          "item": "https://saumyadeepch.vercel.app/journey"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Resume",
          "item": "https://saumyadeepch.vercel.app/resume"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Blog",
          "item": "https://saumyadeepch.vercel.app/blog"
        }
      ]
    }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Inject dynamic structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        {/* Development Remote Console Error Overlay */}
        {process.env.NODE_ENV === "development" && (
          <Script
            id="remote-error-overlay"
            strategy="beforeInteractive"
          >
            {`
              if (typeof window !== 'undefined') {
                // 1. Uncaught global runtime errors
                window.onerror = function(msg, url, line, col, error) {
                  var div = document.createElement('div');
                  div.style.position = 'fixed';
                  div.style.top = '0';
                  div.style.left = '0';
                  div.style.width = '100%';
                  div.style.background = '#ff0033';
                  div.style.color = '#ffffff';
                  div.style.padding = '12px 16px';
                  div.style.zIndex = '999999';
                  div.style.fontSize = '12px';
                  div.style.fontFamily = 'monospace';
                  div.style.wordBreak = 'break-all';
                  div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                  div.innerHTML = '<strong>Remote Global Error:</strong> ' + msg + '<br/><small>at ' + url + ':' + line + ':' + col + '</small>';
                  document.documentElement.appendChild(div);
                };

                // 2. Unhandled Promise Rejections
                window.onunhandledrejection = function(event) {
                  var div = document.createElement('div');
                  div.style.position = 'fixed';
                  div.style.top = '0';
                  div.style.left = '0';
                  div.style.width = '100%';
                  div.style.background = '#ff8800';
                  div.style.color = '#ffffff';
                  div.style.padding = '12px 16px';
                  div.style.zIndex = '999999';
                  div.style.fontSize = '12px';
                  div.style.fontFamily = 'monospace';
                  div.style.wordBreak = 'break-all';
                  div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                  div.innerHTML = '<strong>Remote Promise Rejection:</strong> ' + (event.reason ? (event.reason.message || event.reason) : 'Unknown rejection') + '';
                  document.documentElement.appendChild(div);
                };

                // 3. React Hydration / Console Errors
                var originalConsoleError = console.error;
                console.error = function() {
                  // Call original console.error so it shows in terminal
                  originalConsoleError.apply(console, arguments);
                  
                  // Convert arguments to string
                  var args = Array.prototype.slice.call(arguments);
                  var msg = args.map(function(arg) {
                    if (arg instanceof Error) return arg.message + '\\n' + arg.stack;
                    if (typeof arg === 'object') {
                      try { return JSON.stringify(arg); } catch(e) { return String(arg); }
                    }
                    return String(arg);
                  }).join(' ');

                  // Ignore hot reload noise if any, focus on hydration/react errors
                  if (msg.indexOf('ping') !== -1 || msg.indexOf('HMR') !== -1) return;

                  var div = document.createElement('div');
                  div.style.position = 'fixed';
                  div.style.top = '0';
                  div.style.left = '0';
                  div.style.width = '100%';
                  div.style.background = '#8b0000';
                  div.style.color = '#ffffff';
                  div.style.padding = '12px 16px';
                  div.style.zIndex = '999999';
                  div.style.fontSize = '12.5px';
                  div.style.fontFamily = 'monospace';
                  div.style.wordBreak = 'break-all';
                  div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';
                  div.innerHTML = '<strong>React/Console Error:</strong> ' + msg.replace(/\\n/g, '<br/>');
                  document.documentElement.appendChild(div);
                };
              }
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary selection:bg-cyan-accent/20 selection:text-cyan-accent relative">
        <Providers>
          {/* Layer 0: canvas background */}
          <StarField />
          
          {/* Layer 1: Site contents */}
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            {children}
          </div>
          
          {/* Floating Social Buttons */}
          <SocialFloat />
        </Providers>
      </body>

    </html>
  );
}
