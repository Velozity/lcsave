import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lethal Company Save Editor",
  description: "Modify your Lethal Company save files",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        async
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-B9C8LVZLWC"
      ></Script>
      <Script strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-B9C8LVZLWC', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
