"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";
import Image from "next/image";
import Link from "next/link";

type User = {
  fullName: string;
  email: string;
  phoneNumber?: number;
  password: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");

    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    alert("Logout successful!");
    router.push("/");
  }

  return (
    <main className="min-h-screen pb-24">

        <section className="px-4 pt-6 text-black">
            <Image src="/avatar_placeholder.png" alt="Profile Picture Default" width={100} height={100} className="mx-auto mt-14 rounded-full" />

            <div className="mt-4 rounded-2xl p-4 text-center">
              <p className="font-semibold">
                {currentUser?.email ?? "Guest User"}
              </p>
            </div>
        </section>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between">
            <h2 className="font-bold">Account Information</h2>
            <span className="text-xl text-gray-400">&gt;</span>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between">
            <h2 className="font-bold">Booking History</h2>
            <span className="text-xl text-gray-400">&gt;</span>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between">
            <h2 className="font-bold">Payment Method</h2>
            <span className="text-xl text-gray-400">&gt;</span>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
            {currentUser?.email ? (
                  <Link 
                  onClick={handleLogout}
                  href="/"
                  className="font-bold hover:underline text-red-600">
                    Logout
                  </Link>
                ) : (
                  <Link
                  href="/login"
                  className="font-bold hover:underline text-black">
                    Login
                  </Link>
                )}
          </div>
        </div>

        <Footer />
    </main>
  );
}