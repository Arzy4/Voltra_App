"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";
import Image from "next/image";
import Link from "next/link";

type User = {
  email: string;
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

              {currentUser?.email ? (
                <Link 
                onClick={handleLogout}
                href="/"
                className="text-blue-500 hover:underline">
                  Logout
                </Link>
              ) : (
                <Link
                href="/login"
                className="text-blue-500 hover:underline">
                  Login
                </Link>
              )}
            </div>
        </section>

        <Footer />
    </main>
  );
}