"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "./button";

export default function Navbar1() {
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header>
            <nav className="relative top-0 z-10 px-8 sm:px-8 py-5 sm:py-8 flex justify-between items-center shadow-lg">
                <Link href="/"><Image src="/Voltra_Logo.png" alt="Voltra Logo" width={150} height={150} className="w-[110px] sm:w-[150px] h-auto"/></Link>
    
                <ul className="hidden md:flex font-bold text-xl lg:text-2xl gap-4 lg:gap-6 justify-center items-center">
                    <li>
                        <Link 
                        href="/"
                        className={pathname === "/" ? "underline underline-offset-8" : ""}>
                            HOME
                        </Link>
                    </li>
        
                    <li>
                        <Link 
                        href="/about"
                        className={pathname === "/about" ? "underline underline-offset-8" : ""}>
                            ABOUT
                        </Link>
                    </li>
        
                    <li>
                        <Link 
                        href="/contact"
                        className={pathname === "/contact" ? "underline underline-offset-8" : ""}>
                            CONTACT US
                        </Link>
                    </li>
        
                    <li>
                        <Link href="/auth" className="font-normal text-xl">
                            <Button text="SIGN IN"/>
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
                {menuOpen ? (
                    <X size={30} />
                ) : (
                    <Menu size={30} />
                )}
                </button>

                {/* MOBILE NAVIGATION */}
                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
                        <ul className="flex flex-col items-center gap-6 py-8 font-bold text-xl">

                        <li>
                            <Link
                            href="/"
                            onClick={() => setMenuOpen(false)}
                            className={
                                pathname === "/"
                                ? "underline underline-offset-8"
                                : ""
                            }
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
                            className={
                                pathname === "/contact"
                                ? "underline underline-offset-8"
                                : ""
                            }
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
        </header>
    );
}