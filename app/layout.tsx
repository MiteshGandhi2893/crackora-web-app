import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Roboto } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { ExamProvider } from "@/providers/ExamsProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Crackora - Clarity before Confidence",
  description: "Crackora is an exam preparation platform built on the principle of Clarity before Confidence. We offer concept-driven learning, structured resources, expert guidance, and practical strategies to help students prepare smarter and succeed faster.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${geistMono.variable} bg-white  no-scrollbar lg:overflow-y-auto`}>
        <AuthProvider>
          <ExamProvider>
            <div className="pt-16">{children}</div>
          </ExamProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
