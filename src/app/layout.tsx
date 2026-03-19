import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FounderEngine Dashboard",
  description: "High-level architecture for the modern solo founder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${manrope.variable} antialiased bg-background text-on-background min-h-screen overflow-x-hidden`}
      >
        <Sidebar />

        {/*
          Mobile:  top bar = 56px, bottom tab bar = 64px → pt-14 pb-16
          Desktop: sidebar is 256px wide → md:ml-64, no extra top/bottom padding
        */}
        <div className="pt-14 pb-16 md:pt-0 md:pb-0 md:ml-64 min-h-screen flex flex-col overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
