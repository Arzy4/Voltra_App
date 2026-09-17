"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/button";
import Input from "../components/input";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [redirectPath, setRedirectPath] = useState("/stationPage");

    const [modal, setModal] = useState({
        open: false,
        type: "success" as "success" | "error",
        title: "",
        message: "",
    });

    const showModal = (
        type: "success" | "error",
        title: string,
        message: string
    ) => {
    setModal({
        open: true,
            type,
            title,
            message,
        });
    };

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !password) {
            showModal(
                "error",
                "Missing Information",
                "Please fill in all fields."
            );
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_API_URL is not defined.");
            }

            const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
            });

            const result = await response.json();

            if (!response.ok) {
                showModal(
                    "error",
                    "Login Failed",
                    result.message || "Invalid email or password."
                );

            return;
            }

            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            if (result.user) {
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(result.user)
                );

                if (result.user.role === "ADMIN") {
                    setRedirectPath("/admin");
                } else {
                    setRedirectPath("/stationPage");
                }
            }

            showModal(
                "success",
                "Login Successful",
                "Welcome back to VOLTRA!"
            );
            
        } catch (error) {
            showModal(
                "error",
                "Login Failed",
                "Your email or password is incorrect."
            );
        }
    }

    return(
        <form onSubmit={handleLogin} className="flex flex-col gap-4 placeholder:text-white">
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-border-soft px-4 py-3 pr-12 outline-none focus:border-primary-green"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-green"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                    <EyeOff size={20} />
                    ) : (
                    <Eye size={20} />
                    )}
                </button>
            </div>
            
            <Button text="Login" />
            
            {modal.open && (
                createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                            <div
                            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
                                modal.type === "success"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                            >
                            <span className="text-2xl">
                                {modal.type === "success" ? "✓" : "✕"}
                            </span>
                            </div>

                            <h2 className="text-center text-2xl font-bold text-gray-900">
                            {modal.title}
                            </h2>

                            <p className="mt-3 text-center text-gray-600">
                            {modal.message}
                            </p>

                            <button
                            type="button"
                            onClick={() => {
                                setModal((prev) => ({
                                ...prev,
                                open: false,
                                }));

                                if (modal.type === "success") {
                                    router.push(redirectPath);
                                }
                            }}
                            className={`mt-7 w-full rounded-xl px-4 py-3 font-semibold text-white duration-300 ${
                                modal.type === "success"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                            >
                            {modal.type === "success" ? "Continue" : "Try Again"}
                            </button>
                        </div>
                    </div>,
                    document.body
                )
            )}

        </form>
    )
}