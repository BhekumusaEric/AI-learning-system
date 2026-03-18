import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ProgressProvider } from "@/components/providers/ProgressProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SAAIO Training Grounds",
  description: "Learn Artificial Intelligence hands-on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased`}
      >
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
