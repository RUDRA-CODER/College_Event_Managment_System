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
  const isCoordinatorRoute = pathname?.startsWith('/coordinator');

  return (
    <>
      {!isCoordinatorRoute && <Navbar />}
      <main className={isCoordinatorRoute ? "" : "flex-grow"}>
        {children}
      </main>
      {!isCoordinatorRoute && <Footer />}
    </>
  );
}
