"use client";

import Link from "next/link";
import Footer from "../../components/footer";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isOngoingActive =
    pathname === "/bookingsPage/activePage";
  const isHistoryActive =
    pathname === "/bookingsPage/historyPage";
    
  return (
    
    <main className="min-h-screen pb-24">
      <section className="sticky top-0 z-50 rounded-b-[20px] bg-primary-green px-6 py-6">
        <div className="mb-3 h-[10svh] text-white">
          <Image src="/Voltra_Light_Logo.png" alt="Voltra Logo" width={150} height={150} className=""/>

          <div className="mt-4 grid grid-cols-2 gap-4 text-center text-lg font-bold italic">
            <Link 
              href="/bookingsPage/activePage"
              className={`border-r border-green-300 text-center 
                ${pathname === "/bookingsPage/activePage" 
                  ? "underline underline-offset-8" 
                  : ""
                }` } 
              >
                  ONGOING
            </Link>

            <Link 
              href="/bookingsPage/historyPage"
              className={`text-center 
                ${pathname === "/bookingsPage/historyPage" 
                  ? "underline underline-offset-8" 
                  : ""
                }` } 
              >
                  HISTORY
            </Link>
          </div>
        </div>
      </section>

      {children}

      <Footer />
    </main>
  );
}