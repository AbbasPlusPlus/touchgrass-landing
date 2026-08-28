import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { deployedUrl, site } from "@/lib/site";
import "./globals.css";

// Both are variable fonts — the design leans on in-between weights (420, 440, 340),
// so take the whole axis rather than a handful of static cuts.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL(deployedUrl),
  title: `${site.name} — a break reminder for macOS`,
  description: site.tagline,
  applicationName: site.name,
  keywords: ["break reminder", "macOS", "eye strain", "20-20-20", "menu bar app", "screen breaks"],
  icons: { icon: "/mark.svg", apple: "/mark.svg" },
  openGraph: {
    type: "website",
    url: deployedUrl,
    siteName: site.name,
    title: `${site.name} — a break reminder for macOS`,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} for macOS`,
    description: site.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#20241d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
