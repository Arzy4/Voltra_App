"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "../components/button";
import { usePathname } from "next/navigation";
import { Target, Eye } from "lucide-react";

export default function About() {
    const pathname = usePathname();

    return (
        <>
        <section>
            <nav className="absolute top-0 left-0 w-full z-50 px-8 py-8 flex justify-between items-center bg-transparent text-white">
                <Link href="/">
                    <Image
                    src="/Voltra_Light_Logo.png"
                    alt="Voltra Light Logo"
                    width={150}
                    height={150}
                    />
                </Link>

                <ul className="font-bold text-2xl flex gap-4 justify-center items-center">
                    <li>
                    <Link
                        href="/"
                        className={pathname === "/" ? "underline underline-offset-8" : ""}
                    >
                        HOME
                    </Link>
                    </li>

                    <li>
                    <Link
                        href="/about"
                        className={pathname === "/about" ? "underline underline-offset-8" : ""}
                    >
                        ABOUT
                    </Link>
                    </li>

                    <li>
                    <Link
                        href="/contact"
                        className={pathname === "/contact" ? "underline underline-offset-8" : ""}
                    >
                        CONTACT US
                    </Link>
                    </li>

                    <li>
                    <Link href="/login" className="font-normal text-xl">
                        <Button text="SIGN IN" />
                    </Link>
                    </li>
                </ul>
                </nav>
        </section>

        <section >
            <div className="intro">
                <h1 className="text-6xl max-w-[50%] font-bold">Charging should be simple. So we made it smarter.</h1>
                <p className="text-2xl max-w-[60%]">
                    Voltra helps EV drivers discover charging stations, check availability, and reserve their charging slot before they arrive.
                </p>
            </div>
        </section>

        <section className="flex px-50 py-15 mb-15 gap-10">
            <div>
                <Image src="/About_2.png" alt="About 2 Image" width={400} height={600} className="rounded-xl"/>
            </div>
            <div className="max-w-[60%] mx-auto flex flex-col gap-4">
                <h2 className="text-4xl font-bold">BUILT FOR A BETTER CHARGING EXPERIENCE</h2>
                <p className="text-xl">Finding an available EV Charging shouldn't be complicated. From finding a nearby station to choosing the right charger and booking your slot, Voltra helps make every charging journey easier.</p>
            </div>
        </section>

        <section className="drives py-15">
            <h2 className="text-4xl font-bold ">WHAT DRIVES VOLTRA</h2>

            <div className="grid grid-cols-2 justify-items-center gap-20 py-15 text-center mx-[40px] ">
                <div className="bg-primary-green flex flex-col justify-center items-center rounded-xl max-w-[400px] h-[300px] w-full gap-4 shadow-lg mx-4">
                    <Target size={48} strokeWidth={1.8} className="mb-5" />
                    <h3 className="font-bold text-2xl">Our Mission</h3>
                    <p className="text-lg max-w-[350px]">Make EV Charging more accessible through a simple digital booking experience</p>
                </div>

                <div className="bg-primary-green flex flex-col justify-center items-center rounded-xl max-w-[400px] h-[300px] w-full gap-4 shadow-lg mx-4">
                    <Eye size={48} strokeWidth={1.8} className="mb-5" />
                    <h3 className="font-bold text-2xl">Our Vision</h3>
                    <p className="text-lg max-w-[350px]">A future where EV Charging is simple, connected, and accessible</p>
                </div>
            </div>
        </section>

        <footer className="bg-[#c2f3db] pl-16 py-12 shadow-[0_-8px_20px_rgba(0,0,0,0.15)]">
            <div className="mb-15 max-w-[90%] mx-auto text-white">
                <div className="bg-primary-green px-10 py-10 flex justify-between items-center rounded-xl">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold">READY TO CHARGE SMARTER?</h2>
                        <p className="text-lg">Sign in, find available EV Charging Stations, and reserve your next charge</p>
                    </div>
                    
                    <Link href="/login">
                        <Button text="Sign in and find nearest charging stations"/>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-12 items-start max-w-7xl mx-auto">
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
                    <li><Link href="/policy" className="hover:underline underline-offset-4 text-lg ">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:underline underline-offset-4 text-lg ">Terms & Conditions</Link></li>
                    </ul>
                </div>
            </div>

            <hr className="mr-16 mt-12" />

            <div className="flex justify-between text-center pt-12 pr-16">
                <p>Latest Update: September 9, 2026</p>
                <p>&copy; 2026 VOLTRA. All rights reserved.</p>
            </div>
        </footer>
        </>
    );
}