import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Faster font loading
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap', // Faster font loading
  preload: true,
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://eliche-radice-production.up.railway.app';
const cleanApiUrl = apiUrl.replace(/\/$/, '');

export const metadata: Metadata = {
  title: "Eliche Radice LB - Professional Yacht Maintenance | Lebanon",
  description: "Expert yacht maintenance and support services in Lebanon. Always reachable when your vessel needs it most. 24/7 emergency response, routine maintenance, inspections, and engine service.",
  keywords: ["yacht maintenance", "boat service", "marine engineering", "Lebanon", "yacht repair", "marine maintenance"],
  openGraph: {
    title: "Eliche Radice LB - Professional Yacht Maintenance",
    description: "Expert yacht maintenance and support services. Always reachable when your vessel needs it most.",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/images/Logo navy-01.png', type: 'image/png' },
    ],
    apple: '/images/Logo navy-01.png',
    shortcut: '/images/Logo navy-01.png',
  },
  other: {
    'preconnect': cleanApiUrl,
    'dns-prefetch': cleanApiUrl,
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
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
