"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "../components/button";
import { usePathname } from "next/navigation";
import { Target, Eye, Menu, X } from "lucide-react";
import { useState } from "react";
import Footer1 from "../components/footer1";

export default function About() {
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
        <section>
            <nav className="absolute top-0 left-0 w-full z-50 px-4 sm:px-8 py-5 sm:py-8 flex justify-between items-center bg-transparent text-white">
                <Link href="/">
                    <Image
                        src="/Voltra_Light_Logo.png"
                        alt="Voltra Light Logo"
                        width={150}
                        height={150}
                        className="w-[110px] sm:w-[150px] h-auto"
                    />
                </Link>

                <ul className="hidden md:flex font-bold text-xl lg:text-2xl gap-4 lg:gap-6 justify-center items-center">
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
                        <Link href="/auth" className="font-normal text-xl">
                            <Button text="SIGN IN" />
                        </Link>
                    </li>
                </ul>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {menuOpen ? <X size={30} /> : <Menu size={30} />}
                </button>

                {/* MOBILE NAVIGATION */}
                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-primary-green shadow-lg md:hidden">
                        <ul className="flex flex-col items-center gap-6 py-8 font-bold text-xl">
                            <li>
                                <Link
                                    href="/"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    HOME
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/about"
                                    onClick={() => setMenuOpen(false)}
                                    className={
                                    pathname === "/about"
                                        ? "underline underline-offset-8"
                                        : ""
                                    }
                                >
                                    ABOUT
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    CONTACT US
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/auth"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Button text="SIGN IN" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </section>

        <section >
            <div className="intro px-5 sm:px-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-5xl font-bold">Charging should be simple. So we made it smarter.</h1>
                <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl">
                    Voltra helps EV drivers discover charging stations, check availability, and reserve their charging slot before they arrive.
                </p>
            </div>
        </section>

        <section className="flex flex-col md:flex-row items-center px-5 sm:px-8 lg:px-20 xl:px-50 py-10 sm:py-15 mb-10 sm:mb-15 gap-8 lg:gap-10">
            <div className="w-full md:w-2/5 flex justify-center">
                <Image 
                    src="/About_2.png" 
                    alt="About 2 Image" 
                    width={400} 
                    height={600} 
                    className="rounded-xl w-full max-w-[400px] h-auto"
                />
            </div>
            <div className="w-full md:w-3/5 flex flex-col gap-4 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold">BUILT FOR A BETTER CHARGING EXPERIENCE</h2>
                <p className="text-lg sm:text-xl leading-relaxed">Finding an available EV Charging shouldn't be complicated. From finding a nearby station to choosing the right charger and booking your slot, Voltra helps make every charging journey easier.</p>
            </div>
        </section>

        <section className="drives py-10 sm:py-15 px-5 sm:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center">WHAT DRIVES VOLTRA</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-6 md:gap-10 lg:gap-20 py-10 sm:py-15 text-center w-full max-w-5xl mx-auto">
                <div className="bg-primary-green flex flex-col justify-center items-center rounded-xl max-w-[400px] min-h-[260px] sm:min-h-[300px] w-full gap-4 shadow-lg px-6">
                    <Target size={48} strokeWidth={1.8} className="mb-5" />
                    <h3 className="font-bold text-xl sm:text-2xl">Our Mission</h3>
                    <p className="text-base sm:text-lg max-w-[350px]">Make EV Charging more accessible through a simple digital booking experience</p>
                </div>

                <div className="bg-primary-green flex flex-col justify-center items-center rounded-xl max-w-[400px] min-h-[260px] sm:min-h-[300px] w-full gap-4 shadow-lg px-6">
                    <Eye size={48} strokeWidth={1.8} className="mb-5" />
                    <h3 className="font-bold text-xl sm:text-2xl">Our Vision</h3>
                    <p className="text-base sm:text-lg max-w-[350px]">A future where EV Charging is simple, connected, and accessible</p>
                </div>
            </div>
        </section>

        <Footer1>
            <div className="mb-12 sm:mb-15 max-w-7xl mx-auto text-white">
                <div className="bg-primary-green px-6 sm:px-10 py-8 sm:py-10 flex flex-col md:flex-row justify-between items-center gap-6 rounded-xl">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h2 className="text-xl sm:text-2xl font-bold">READY TO CHARGE SMARTER?</h2>
                        <p className="text-base sm:text-lg">Sign in, find available EV Charging Stations, and reserve your next charge</p>
                    </div>
                    
                    <Link href="/auth" className="shrink-0">
                        <Button text="Sign in and find nearest charging stations"/>
                    </Link>
                </div>
            </div>
        </Footer1>
        </>
    );
}