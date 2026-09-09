import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "./button";

export default function Navbar1() {
    const pathname = usePathname();

    return (
        <header>
            <nav className="relative top-0 z-10 px-8 py-8 flex justify-between items-center shadow-lg">
                <Link href="/"><Image src="/Voltra_Logo.png" alt="Voltra Logo" width={150} height={150}/></Link>
    
                <ul className="font-bold text-2xl flex gap-4 justify-center items-center">
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
                    <Link href="/login" className="font-normal text-xl">
                    <Button text="SIGN IN"/>
                    </Link>
                </li>
                </ul>
            </nav>
        </header>
    );
}