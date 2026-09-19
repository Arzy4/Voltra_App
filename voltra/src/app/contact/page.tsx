"use client";

import Button from "../components/button";
import Footer1 from "../components/footer1";
import Input from "../components/input";
import Navbar1 from "../components/navbar1";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";

export default function Contact(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    return(
        <>
        <Navbar1 />

        <section className="flex flex-col justify-center items-center pt-20 sm:pt-24 lg:pt-30 pb-10 sm:pb-15 gap-5 sm:gap-8 lg:gap-10 text-center px-5 sm:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-5xl font-bold">WE'D LOVE TO HEAR FROM YOU</h1>
            <div className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto">
                <p>Have a questions about charging, bookings, or Voltra?</p>
                <p>Our team is ready to help you</p>
            </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start lg:items-center py-10 sm:py-15 lg:py-20 px-5 sm:px-8 lg:px-20 gap-12 lg:gap-16">

        {/* LEFT SIDE - 1/3 */}
        <div className="flex justify-center lg:justify-start items-center">
            <div className="flex flex-col items-center text-center w-full max-w-md">
                <ul className="flex flex-col gap-10">

                    {/* EMAIL */}
                    <li className="flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-2">
                            <Mail
                            size={36}
                            strokeWidth={1.8}
                            className="text-primary-green"
                            />

                            <h2 className="text-2xl font-semibold">
                            Email
                            </h2>
                        </div>

                        <a
                            href="mailto:robbyarzy@gmail.com"
                            className="hover:underline underline-offset-4 text-lg"
                        >
                            robbyarzy@gmail.com
                        </a>
                    </li>

                    {/* WHATSAPP */}
                    <li className="flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-2">
                            <MessageCircle
                            size={36}
                            strokeWidth={1.8}
                            className="text-primary-green"
                            />

                            <h2 className="text-2xl font-semibold">
                            Whatsapp
                            </h2>
                        </div>

                        <p className="text-lg">
                            Mon-Fri from 8am to 5pm
                        </p>

                        <a
                            href="https://wa.me/6282232138510"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline underline-offset-4 text-lg"
                        >
                            0822-3213-8510
                        </a>
                    </li>

                    {/* LOCATION */}
                    <li className="flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-2">
                            <MapPin
                            size={36}
                            strokeWidth={1.8}
                            className="text-primary-green"
                            />

                            <h2 className="text-2xl font-semibold">
                            Location
                            </h2>
                        </div>

                        <p className="text-lg">
                            Surabaya, East Java, Indonesia
                        </p>
                    </li>

                </ul>
                </div>
            </div>


            {/* RIGHT SIDE - 2/3 */}
            <div className="flex justify-center items-center">
                <div className="flex flex-col gap-5 w-full max-w-4xl lg:pr-10">

                    {/* FIRST + LAST NAME */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <h2>First Name</h2>
                            <Input
                            type="text"
                            placeholder="Type Your First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <h2>Last Name</h2>
                            <Input
                            type="text"
                            placeholder="Type Your Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <h2>Email</h2>
                        <Input
                            type="email"
                            placeholder="Type Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    {/* MESSAGE */}
                    <div>
                        <h2>Message</h2>
                        <textarea
                            placeholder="Type Your Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={8}
                            className="w-full rounded-xl border border-[2px] px-4 py-3 outline-none focus:ring-2 focus:ring-primary-green resize-none"
                        />
                    </div>
                    
                    <Button text="Send Message" />

                </div>
            </div>

        </section>

        <Footer1 />
        </>
    );
}