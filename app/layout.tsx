import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech Procod Pvt Ltd | Web Development, Mobile Apps & Digital Solutions Nepal",
  description:
    "Tech Procod Pvt Ltd — Leading digital solutions company in Nepal. Web development, mobile apps, e-commerce, AI integration, custom software. 50+ projects delivered. Get a free quote today.",
  keywords: [
    "Tech Procod",
    "web development Nepal",
    "mobile app development Nepal",
    "e-commerce solutions Nepal",
    "digital marketing Nepal",
    "software development Siraha",
    "AI integration Nepal",
    "UI/UX design Nepal",
    "custom software Nepal",
    "website design Nepal",
    "app development Madhesh",
    "digital agency Nepal",
  ],
  authors: [{ name: "Tech Procod Pvt Ltd" }],
  creator: "Tech Procod Pvt Ltd",
  publisher: "Tech Procod Pvt Ltd",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://techprocod.com",
    siteName: "Tech Procod Pvt Ltd",
    title: "Tech Procod Pvt Ltd | Digital Solutions for Nepal",
    description:
      "Leading digital solutions company in Nepal. Web development, mobile apps, e-commerce, AI integration, and custom software.",
    images: [
      {
        url: "https://techprocod.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tech Procod Pvt Ltd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Procod Pvt Ltd | Digital Solutions Nepal",
    description: "Web development, mobile apps, e-commerce, and custom software for Nepal",
    images: ["https://techprocod.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://techprocod.com",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tech Procod Pvt Ltd",
              url: "https://techprocod.com",
              logo: "https://techprocod.com/logo.png",
              description: "Leading digital solutions company in Nepal providing web development, mobile apps, e-commerce, and custom software.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Siraha",
                addressLocality: "Siraha",
                addressRegion: "Madhesh Pradesh",
                postalCode: "12345",
                addressCountry: "NP",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+977-9800000000",
                email: "info@techprocod.com",
              },
              sameAs: [
                "https://www.facebook.com/techprocod",
                "https://www.linkedin.com/company/techprocod",
                "https://twitter.com/techprocod",
              ],
              areaServed: "NP",
              knowsAbout: [
                "Web Development",
                "Mobile App Development",
                "E-commerce Solutions",
                "UI/UX Design",
                "AI Integration",
                "Custom Software",
              ],
            }),
          }}
        />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Tech Procod Pvt Ltd",
              image: "https://techprocod.com/logo.png",
              description: "Digital solutions company in Nepal",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Siraha",
                addressLocality: "Siraha",
                addressRegion: "Madhesh Pradesh",
                postalCode: "12345",
                addressCountry: "NP",
              },
              telephone: "+977-9800000000",
              email: "info@techprocod.com",
              url: "https://techprocod.com",
              priceRange: "$$",
              areaServed: "NP",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "50",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  );
}
