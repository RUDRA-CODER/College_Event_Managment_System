import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CKPCET Events | College Event Management System",
  description: "Discover, explore, and participate in events at C. K. Pithawala College of Engineering and Technology (CKPCET), Surat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
