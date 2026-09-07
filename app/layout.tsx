import type { Metadata } from "next";
import {
  Cairo,
  IBM_Plex_Sans_Arabic,
  Inter,
  Montserrat,
} from "next/font/google";

import "./globals.scss";
import { LayoutProvider } from "@/components/layout/layout-context";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AppShell from "@/components/layout/AppShell";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

export const metadata: Metadata = {
  title: "Stemawy",
  description: "An educational platform for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${inter.variable} ${cairo.variable} ${ibmPlexSansArabic.variable}`}
      >
        <ThemeProvider>
          <LayoutProvider>
            <AppShell>{children}</AppShell>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
