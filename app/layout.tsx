import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://migrait.app"),
  title: { default: "Migrait — Data Migration Accelerated", template: "%s | Migrait" },
  description:
    "Migrate 5 million records in under 2 hours. Migrait is the data migration platform built for consultancies. AI field mapping, live dashboard, zero infrastructure.",
  keywords: [
    "data migration",
    "Dynamics 365 migration",
    "Dataverse migration",
    "data migration platform",
    "migration consultancy tools",
  ],
  openGraph: {
    title: "Migrait — Data Migration Accelerated",
    description: "Migrate 5 million records in under 2 hours.",
    url: "https://migrait.app",
    siteName: "Migrait",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Migrait — Data Migration Accelerated",
    description: "Migrate 5 million records in under 2 hours.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-night`}>
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
