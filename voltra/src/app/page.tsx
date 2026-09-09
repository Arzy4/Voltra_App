"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "./components/button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CalendarCheck, Zap, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import Navbar1 from "./components/navbar1";
import Footer1 from "./components/footer1";

export default function Home() {
  const pathname = usePathname();

  return (
    <>
    <main className="min-h-screen pb-24">

      <Navbar1 />

      <section className="bg-[#c2f3db] mx-20 rounded-bl-xl rounded-br-4xl shadow-lg">
        <div className="h-[70svh] flex flex-col justify-center items-center mb-25 gap-6 text-center">
          <h1 className="text-6xl max-w-[50%] font-bold">Charge Your EV Smarter with Voltra</h1>
          <p className="text-2xl max-w-[60%]">Find nearby charging stations, check real-time availability, and reserve your charging slot in seconds.</p>

          <Link href="/login"><Button text="Sign in and find nearest charging stations"/></Link>
        </div>
      </section>

      <section className="carousel">
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card"/>
        </div>
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card"/>
        </div>
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card"/>
        </div>
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card"/>
        </div>
      </section>

      <section className="m-15 flex items-stretch shadow-lg rounded-[30px]">
        {/* LEFT SIDE */}
        <div className="bg-primary-green w-2/3 py-10 px-12 flex flex-col justify-center items-center gap-10 text-white rounded-l-[30px]">
          
          <h2 className="text-4xl font-bold">
            CHARGING MADE EFFORTLESS
          </h2>

          <div className="py-8">
            <div className="space-y-4 text-xl">

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <p>Find nearby charging stations</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <p>Reserve charging slots in advance</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <p>View real-time charger availability</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <p>Choose Normal, Fast, or Ultra Charging</p>
              </div>

            </div>
          </div>

          <Link href="/about">
            <Button text="Learn More About Voltra →" />
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative w-1/3">
          <Image
            src="/Landing_Page_1.png"
            alt="EV charging with Voltra"
            fill
            className="object-cover rounded-r-[30px]"
          />
        </div>
      </section>

      <section className="pt-14">
        <h2 className="text-center text-4xl font-bold">WHY VOLTRA</h2>
        <h3 className="text-center text-2xl py-10 max-w-[80%] mx-auto">Everything you need for a smarter and more seamless charging experience, making EV charging simple, convenient, and accessible wherever you go.</h3>

        <ul className="grid grid-cols-3 justify-items-center gap-6 py-7 text-center mx-[40px]">
          <li className="bg-[#c2f3db] flex flex-col justify-center items-center rounded-xl max-w-[400px] h-[300px] w-full gap-4 shadow-lg">
            <CalendarCheck size={48} strokeWidth={1.5} />
            <h3 className="font-bold text-2xl">EASY BOOKING</h3>
            <p className="text-lg max-w-[350px]">Reserve your charging slot in just a few simple steps.</p>
            </li>

            <li className="bg-[#c2f3db] flex flex-col justify-center items-center rounded-xl max-w-[400px] w-full gap-4 shadow-lg">
              <Zap size={48} strokeWidth={1.5} />
              <h3 className="font-bold text-2xl">REAL-TIME AVAILABILITY</h3>
              <p className="text-lg max-w-[350px]">See available charging slots and choose the time that works for you.</p>
            </li>

            <li className="bg-[#c2f3db] flex flex-col justify-center  items-center rounded-xl max-w-[400px] w-full gap-4 shadow-lg">
              <Sparkles size={48} strokeWidth={1.5} />
              <h3 className="font-bold text-2xl">SIMPLE YET FUN EXPERIENCE</h3>
              <p className="text-lg max-w-[350px]">Find, book, and charge with an experience that keeps things simple.</p>
            </li>
        </ul>
      </section>
    </main>

    <Footer1 />
    </>
  );
}