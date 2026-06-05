import type { Metadata } from "next";
import { Tsukimi_Rounded } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Malunggay Pandesal Management System",
  description: "Malunggay pandesal tag dos ra malamion ug masustansya pa!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${tsukimi.className} min-h-screen antialiased`}>
      <body className={`min-h-screen flex flex-col`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
