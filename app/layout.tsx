import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://joelpendleton.com"),
  title: "Joel Pendleton - CTO at Conductor Quantum",
  description: "Joel Pendleton is CTO and Co-Founder at Conductor Quantum, building software for quantum computers. Previously at Oxford, Y Combinator S24, and various quantum computing companies.",
  keywords: ["Joel Pendleton", "quantum computing", "CTO", "Conductor Quantum", "silicon quantum computers", "Y Combinator", "Oxford", "quantum technology"],
  authors: [{ name: "Joel Pendleton", url: "https://joelpendleton.com" }],
  creator: "Joel Pendleton",
  publisher: "Joel Pendleton",
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
    canonical: "https://joelpendleton.com",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
