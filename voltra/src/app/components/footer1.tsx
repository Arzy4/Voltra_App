"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer1() {
    const pathname = usePathname();

    return (
        <footer className="bg-[#c2f3db] pl-16 py-12 shadow-[0_-8px_20px_rgba(0,0,0,0.15)]">
          <section className="grid grid-cols-4 gap-12 items-start max-w-7xl mx-auto">

            {/* VOLTRA */}
            <div className="flex flex-col gap-4">
              <Image
                src="/Voltra_Logo.png"
                alt="Voltra Logo"
                width={200}
                height={200}
              />

              <p className="text-lg  text-justify leading-relaxed max-w-[300px]">
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

          <hr className="mr-16 my-12" />

          <div className="flex justify-between text-center pr-16">
              <p>Latest Update: September 9, 2026</p>
              <p>&copy; 2026 VOLTRA. All rights reserved.</p>
          </div>
        </footer>
    );
}