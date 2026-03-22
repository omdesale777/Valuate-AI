import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-geist antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}