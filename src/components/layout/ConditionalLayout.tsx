"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isExcludedRoute = pathname?.startsWith('/coordinator') || pathname?.startsWith('/admin');

  return (
    <>
      {!isExcludedRoute && <Navbar />}
      <main className={isExcludedRoute ? "" : "flex-grow"}>
        {children}
      </main>
      {!isExcludedRoute && <Footer />}
    </>
  );
}
