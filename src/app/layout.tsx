import type { Metadata, Viewport } from "next";
import { ProgressProvider } from "@/components/providers/ProgressProvider";
import "./globals.css";

// Font CSS variables are loaded via globals.css @import to avoid
// build-time network dependency on fonts.googleapis.com
const jetbrainsMono = { variable: "--font-jetbrains-mono" };
const inter = { variable: "--font-inter" };

export const metadata: Metadata = {
  title: "WeThinkCode_ IDC Curriculum",
  description: "Next-generation AI and Python training environment.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WeThinkCode_",
  },
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#00ff9d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} font-sans antialiased`}
      >
        <div className="bg-white/10 p-1.5 rounded-lg">
          <img src="/logo_white.png" alt="WeThinkCode" className="w-8 h-8 object-contain" />
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          WeThinkCode_ IDC Curriculum
        </h1>
        <ProgressProvider>
          {children}
        </ProgressProvider>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </body>
    </html>
  );
}
