"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer1({
  children,
}: {
  children?: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <footer className="bg-[#c2f3db] px-6 sm:px-8 lg:px-16 py-10 sm:py-12 shadow-[0_-8px_20px_rgba(0,0,0,0.15)]">
          
          {children}

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 items-start max-w-7xl mx-auto">

            {/* VOLTRA */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Image
                src="/Voltra_Logo.png"
                alt="Voltra Logo"
                width={200}
                height={200}
                className="w-[150px] sm:w-[180px] lg:w-[200px] h-auto"
              />

              <p className="text-base sm:text-lg text-center md:text-left leading-relaxed max-w-[400px]">
                Powering your journey with smarter, simpler, and more accessible
                EV charging, so you can enjoy seamless booking and convenience
                wherever you go.
              </p>
            </div>

            {/* NAVIGATION */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <h3 className="font-bold text-xl">
                Navigation
              </h3>

              <ul className="flex flex-col items-center gap-2">
                <li><Link href="/" className="hover:underline underline-offset-4 text-lg ">Home</Link></li>
                <li><Link href="/about" className="hover:underline underline-offset-4 text-lg ">About</Link></li>
                <li><Link href="/contact" className="hover:underline underline-offset-4 text-lg">Contact Us</Link></li>
                <li><Link href="/login" className="hover:underline underline-offset-4text-lg  text-lg ">Sign In</Link></li>
              </ul>
            </div>

            {/* SOCIAL MEDIA */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <h3 className="font-bold text-xl">
                Social Media
              </h3>

              <ul className="flex flex-col items-center gap-2">
                <li><a href="https://www.instagram.com/rbby_rzy/" className="hover:underline underline-offset-4 text-lg ">Instagram</a></li>
                <li><a href="https://www.linkedin.com/in/robbyarzy" className="hover:underline underline-offset-4 text-lg ">LinkedIn</a></li>
                <li><a href="https://wa.me/6282232138510" className="hover:underline underline-offset-4 text-lg ">Whatsapp</a></li>
                <li><a href="https://github.com/Arzy4" className="hover:underline underline-offset-4 text-lg ">GitHub</a></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <h3 className="font-bold text-xl">
                Legal
              </h3>

              <ul className="flex flex-col items-center gap-2">
                <li>
                  <Link href="/policy" className={`${pathname === "/policy" ? "underline underline-offset-8" : "" } hover:underline underline-offset-4 text-lg`}>
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link href="/terms" className={`${pathname === "/terms" ? "underline underline-offset-8" : "" } hover:underline underline-offset-4 text-lg`}>
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

          </section>

          <hr className="my-10 sm:my-12 max-w-7xl mx-auto" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
              <p>Latest Update: September 19, 2026</p>
              <p>&copy; 2026 VOLTRA. All rights reserved.</p>
          </div>
        </footer>
    );
}