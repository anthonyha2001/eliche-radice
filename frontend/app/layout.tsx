import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Eliche Radice LB - Professional Yacht Maintenance | Lebanon",
  description: "Expert yacht maintenance and support services in Lebanon. Always reachable when your vessel needs it most. 24/7 emergency response, routine maintenance, inspections, and engine service.",
  keywords: ["yacht maintenance", "boat service", "marine engineering", "Lebanon", "yacht repair", "marine maintenance"],
  openGraph: {
    title: "Eliche Radice LB - Professional Yacht Maintenance",
    description: "Expert yacht maintenance and support services. Always reachable when your vessel needs it most.",
    type: "website",
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
