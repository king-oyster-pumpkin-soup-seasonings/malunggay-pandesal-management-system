import type { Metadata } from "next";
import { Tsukimi_Rounded } from "next/font/google";
import "./globals.css";

const roboto = Tsukimi_Rounded({
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
    <html lang="en" className={`${roboto.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
