import type { Metadata } from "next";
import { Tsukimi_Rounded, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Malunggay Pandesal System",
  description: "Malunggay pandesal tag dos ra malamion ug masustansya pa!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${tsukimi.className} h-full antialiased`}>
      <body className={`min-h-full flex flex-col`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
