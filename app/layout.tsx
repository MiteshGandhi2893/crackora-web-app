import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import { Inter } from "next/font/google";
import { Noto_Sans_Display } from "next/font/google";

import { Roboto } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { SnackbarProvider } from "@/providers/SnackbarProvider";
import { LoadingProvider } from "@/providers/LoadingProvider";
import SessionWatcher from "@/components/SessionWatcher";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Suspense } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",

});


const notoSansDisplay = Noto_Sans_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",

});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Crackora - Clarity before Confidence",
    metadataBase: new URL("https://crackora.com"),

  description:
    "Crackora is an exam preparation platform built on the principle of Clarity before Confidence. We offer concept-driven learning, structured resources, expert guidance, and practical strategies to help students prepare smarter and succeed faster.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${geistMono.variable} ${inter.variable}  ${notoSansDisplay.variable} bg-white  lg:overflow-y-auto`}
      >
        <SnackbarProvider>
          <LoadingProvider>
            <AuthProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <SessionWatcher />
              </Suspense>
                {children}
            </AuthProvider>
          </LoadingProvider>
        </SnackbarProvider>
        <GoogleAnalytics gaId="G-GBJ5XBZPMJ" /> {/* 👈   here */}
      </body>
    </html>
  );
}
