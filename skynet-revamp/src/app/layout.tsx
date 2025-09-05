import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { fetchGlobalSettings, getFaviconUrl } from "@/lib/strapi-global"
import Script from "next/script"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  // Fetch global settings for favicon
  let faviconUrl = "/favicon.ico"
  try {
    const globalSettings = await fetchGlobalSettings()
    if (globalSettings?.favicon) {
      const url = getFaviconUrl(globalSettings.favicon)
      if (url) faviconUrl = url
    }
  } catch (error) {
    console.error("Error fetching favicon:", error)
  }

  return {
  metadataBase: new URL("https://www.skynetww.com"),
  title: "Skynet India - Connecting Your Business to the World | Express Courier Services",
  description:
    "Skynet India offers reliable e-commerce and courier services to over 200 countries. Fast, secure, and trusted delivery solutions with real-time tracking. ISO 9001:2015 certified.",
  keywords:
    "skynet india, international courier service india, express delivery, logistics india, skynet courier, e-commerce delivery, international shipping, air freight india, dangerous goods shipping, worldwide returns",
  authors: [{ name: "Skynet Express India Private Limited" }],
  openGraph: {
    title: "Skynet India - Connecting Your Business to the World",
    description:
      "Reliable e-commerce and courier services to over 200 countries. Skynet simplifies your global reach with fast, secure, and trusted delivery solutions.",
    type: "website",
    locale: "en_IN",
    url: "https://www.skynetww.com",
    siteName: "Skynet India",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Skynet India - Largest Independently Owned Express Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skynet India - Express Courier & Logistics Services",
    description: "Your trusted logistics partner delivering excellence across India and 209+ countries worldwide",
    images: ["/twitter-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://www.skynetww.com",
  },
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '789190690162066');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=789190690162066&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
