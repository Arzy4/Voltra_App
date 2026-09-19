"use client";

import { useState } from "react"
import LoginForm from "@/app/login/loginForm";
import RegisterForm from "@/app/register/registerForm";
import Link from "next/link";
import Image from "next/image";

type AuthPageProps = {
    initialMode?: "login" | "register";
}

export default function AuthPage ({
    initialMode = "login",
}: AuthPageProps) {
    const [mode, setMode] = useState<"login" | "register">(initialMode);

    const isRegister = mode === "register";

    return (
        <main className="min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className={`auth-container ${
                isRegister ? "active" : ""
                }`}
            >

                {/* HOME LOGO */}
                <Link
                    href="/"
                    className="auth-logo"
                    aria-label="Go to VOLTRA homepage"
                >
                    <Image
                        src="/Voltra_Logo.png"
                        alt="Voltra Logo"
                        width={150}
                        height={150}
                    />
                </Link>

                {/* Login Form */}
                <div className="auth-form-panel login-panel">
                    <div className="auth-form">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome Back
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Login now to book your next charging reservation.
                            </p>
                        </div>

                        <LoginForm />

                        {/* MOBILE SWITCH */}
                        <p className="mt-6 text-center text-sm text-gray-500 md:hidden">
                        Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setMode("register")}
                                className="font-semibold text-primary-green"
                            >
                                Register
                            </button>
                        </p>
                    </div>
                </div>
                
                {/* Register Form */}
                 <div
                    className="auth-form-panel register-panel">
                    <div className="auth-form">
                        <div className="mb-6 text-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Create Account
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Join VOLTRA and start booking charging slots.
                            </p>
                        </div>

                        <RegisterForm />

                        {/* MOBILE SWITCH */}
                        <p className="mt-6 text-center text-sm text-gray-500 md:hidden">
                        Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className="font-semibold text-primary-green"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
                
                {/* GREEN SLIDING PANEL */}
                <div
                    className="auth-overlay">
                    <div className="auth-overlay-content">

                        {!isRegister ? (
                        <>
                            <h2 className="text-4xl font-bold">
                                New to VOLTRA?
                            </h2>

                            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/80">
                                Create your account and start finding, booking, and charging
                                at VOLTRA stations.
                            </p>

                            <button
                                type="button"
                                onClick={() => setMode("register")}
                                className="mt-8 rounded-xl border-2 border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-primary-green cursor-pointer"
                            >
                                Register
                            </button>
                        </>
                        ) : (
                        <>
                            <h2 className="text-4xl font-bold">
                                Welcome Back!
                            </h2>

                            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/80">
                                Already have a VOLTRA account? Sign in and continue your
                            charging journey.
                            </p>

                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className="mt-8 rounded-xl border-2 border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-primary-green cursor-pointer"
                            >
                                Login
                            </button>
                        </>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}