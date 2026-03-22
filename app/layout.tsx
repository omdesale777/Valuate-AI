import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ValuateAI — Industrial Property Intelligence for India",
  description:
    "AI-powered valuation platform for industrial properties in Nashik, Mumbai, and Pune. Instant estimates with Gemini AI.",
  themeColor: "#0a0a0a",
  openGraph: {
    title: "ValuateAI — Industrial Property Intelligence",
    description: "AI-powered property valuation for India's industrial corridors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-geist antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}