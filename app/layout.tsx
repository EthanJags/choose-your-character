import type { Metadata } from "next";
import { Geist, Geist_Mono, Londrina_Solid } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Ethan's Portfolio",
  description: "Choose your character and explore Ethan's portfolio",
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
          url: "/openGraph.png",
          width: 1200,
          height: 630,
          alt: "Ethan's Portfolio - Choose Your Character",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ethan's Portfolio",
      description: "Choose your character and explore Ethan's portfolio",
      images: ["/openGraph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${londrinaSolid.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
