import Link from "next/link";
import Image from "next/image";
import Button from "./components/button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CalendarCheck, Zap, Sparkles } from "lucide-react";
import Navbar1 from "./components/navbar1";
import Footer1 from "./components/footer1";

export default function Home() {
  return (
    <>
    <main className="min-h-screen pb-24">

      <Navbar1 />

      <section className="bg-[#c2f3db] mx-4 sm:mx-8 lg:mx-20 rounded-bl-xl rounded-br-4xl shadow-lg">
        <div className="min-h-[70svh] flex flex-col justify-center items-center mb-12 sm:mb-20 lg:mb-25 gap-4 sm:gap-6 text-center px-5 sm:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-5xl font-bold">Charge Your EV Smarter with Voltra</h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl">Find nearby charging stations, check real-time availability, and reserve your charging slot in seconds.</p>

          <Link href="/auth"><Button text="Sign in and find nearest charging stations"/></Link>
        </div>
      </section>

      <section className="carousel">
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
        </div>
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
        </div>
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
        </div>
        <div className="group">
          <Image src="/Find.png" alt="Find Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Select.png" alt="Select Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Book.png" alt="Book Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
          <Image src="/Charge.png" alt="Charge Logo" width={200} height={200} className="card w-[120px] sm:w-[160px] lg:w-[200px] h-auto"/>
        </div>
      </section>

      <section className="mx-4 sm:mx-8 lg:m-15 flex flex-col md:flex-row items-stretch shadow-lg rounded-[30px] overflow-hidden">
        {/* LEFT SIDE */}
        <div className="bg-primary-green w-full md:w-2/3 py-10 px-6 sm:px-10 lg:px-12 flex flex-col justify-center items-center gap-6 lg:gap-10 text-white">
          
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            CHARGING MADE EFFORTLESS
          </h2>

          <div className="py-4 sm:py-8">
            <div className="space-y-4 text-base sm:text-lg lg:text-xl">

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 shrink-0" />
                <p>Find nearby charging stations</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 shrink-0" />
                <p>Reserve charging slots in advance</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 shrink-0" />
                <p>View real-time charger availability</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 shrink-0" />
                <p>Choose Normal, Fast, or Ultra Charging</p>
              </div>

            </div>
          </div>

          <Link href="/about">
            <Button text="Learn More About Voltra →" />
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative w-full md:w-1/3 h-[250px] sm:h-[550px] md:h-auto">
          <Image
            src="/Landing_Page_1.png"
            alt="EV charging with Voltra"
            fill
            className="object-cover rounded-b-[30px]"
          />
        </div>
      </section>

      <section className="pt-10 sm:pt-14 px-4 sm:px-8">
        <h2 className="text-center text-3xl sm:text-4xl font-bold">WHY VOLTRA</h2>
        <h3 className="text-center text-lg sm:text-xl lg:text-2xl py-6 sm:py-10 max-w-5xl mx-auto">Everything you need for a smarter and more seamless charging experience, making EV charging simple, convenient, and accessible wherever you go.</h3>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 py-7 text-center max-w-7xl mx-auto">
          <li className="bg-[#c2f3db] flex flex-col justify-center items-center rounded-xl min-h-[260px] sm:min-h-[300px] w-full gap-4 shadow-lg px-6">
            <CalendarCheck size={48} strokeWidth={1.5} />
            <h3 className="font-bold text-xl sm:text-2xl">EASY BOOKING</h3>
            <p className="text-base sm:text-lg max-w-[350px]">Reserve your charging slot in just a few simple steps.</p>
            </li>

            <li className="bg-[#c2f3db] flex flex-col justify-center items-center rounded-xl min-h-[260px] sm:min-h-[300px] w-full gap-4 shadow-lg px-6">
              <Zap size={48} strokeWidth={1.5} />
              <h3 className="font-bold text-xl sm:text-2xl">REAL-TIME AVAILABILITY</h3>
              <p className="text-base sm:text-lg max-w-[350px]">See available charging slots and choose the time that works for you.</p>
            </li>

            <li className="bg-[#c2f3db] flex flex-col justify-center items-center rounded-xl min-h-[260px] sm:min-h-[300px] w-full gap-4 shadow-lg px-6">
              <Sparkles size={48} strokeWidth={1.5} />
              <h3 className="font-bold text-xl sm:text-2xl">SIMPLE YET FUN EXPERIENCE</h3>
              <p className="text-base sm:text-lg max-w-[350px]">Find, book, and charge with an experience that keeps things simple.</p>
            </li>
        </ul>
      </section>
    </main>

    <Footer1 />
    </>
  );
}