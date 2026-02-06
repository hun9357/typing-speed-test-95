import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Typing Speed Test | Test Your WPM & Accuracy Online",
  description: "Take a free typing speed test and measure your words per minute (WPM) and accuracy. No download required. Instant results with detailed performance metrics.",
  verification: {
    google: "KLUWmaJTvSkVldncIo2cPl6KQtr610FUWuZhywdYN5Y",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
