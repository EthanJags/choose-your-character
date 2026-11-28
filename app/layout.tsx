import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Londrina_Solid, Caveat, Patrick_Hand } from "next/font/google";
import "./globals.css";
import EthanPreloader from "./components/EthanPreloader";
import SoundToggle from "./components/SoundToggle";
import ClickForSoundTooltip from "./components/ClickForSoundTooltip";
import Chatbot from "./components/Chatbot";
import { PostHogProvider } from "./providers";
import { OG_VERSION } from "./lib/og";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const londrinaSolid = Londrina_Solid({
  variable: "--font-londrina-solid",
  weight: "900",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-figma-hand",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const SITE_URL = "https://ethanjagoda.me";

// Read by search engines and agents only; people never see it on the page.
// Link previews keep their own description below.
const AGENT_DESCRIPTION =
  "Ethan Jagoda: full stack engineer and adventurer living in NYC. Choose your character and explore Ethan's portfolio: the adventurer, the engineer, the artist and the misc dude.";

// schema.org Person, in the HTML the server sends. Words taken from the site.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ethan Jagoda",
  url: "https://www.ethanjagoda.me/",
  description: "Full stack engineer and adventurer living in NYC.",
  sameAs: [
    "https://www.linkedin.com/in/ethan-jagoda/",
    "https://github.com/ethanjags",
    "https://x.com/ethanjagoda",
    "https://instagram.com/ethan_jags",
    "https://medium.com/@ethanjags1",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ethan's Portfolio",
  description: AGENT_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ethan's Portfolio",
    description: "Choose your character and explore Ethan's portfolio",
    type: "website",
    url: "/",
    siteName: "Ethan's Portfolio",
    images: [
      {
        url: `/og/home.jpg?v=${OG_VERSION}`,
        width: 1200,
        height: 630,
        alt: "Select Your Ethan: the Adventurer, the Engineer, the Artist and the Misc Dude",
      },
    ],
    // Looping spotlight video (regenerate with `npm run og`). Plays where
    // og:video is supported (Discord, Telegram, iMessage); X shows the image.
    // Absolute URL: Next does not resolve video URLs against metadataBase.
    videos: [
      {
        url: `${SITE_URL}/og/home.mp4?v=${OG_VERSION}`,
        secureUrl: `${SITE_URL}/og/home.mp4?v=${OG_VERSION}`,
        width: 1200,
        height: 630,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan's Portfolio",
    description: "Choose your character and explore Ethan's portfolio",
    images: [`/og/home.jpg?v=${OG_VERSION}`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${londrinaSolid.variable} ${caveat.variable} ${patrickHand.variable} antialiased`}
      >
        <PostHogProvider>
          <EthanPreloader />
          {children}
          <SoundToggle />
          <ClickForSoundTooltip />
          <Chatbot />
        </PostHogProvider>
      </body>
    </html>
  );
}
