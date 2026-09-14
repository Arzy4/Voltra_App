"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/button";
import { createPortal } from "react-dom";

export default function RegisterForm() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
            showModal(
                "error",
                "Missing Information",
                "Please fill in all fields."
            );
            return;
        }

        if (password !== confirmPassword) {
            showModal(
                "error",
                "Passwords Do Not Match",
                "Please make sure both passwords are the same."
            );
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
                throw new Error("NEXT_PUBLIC_API_URL is not defined.");
            }

            const response = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    phoneNumber,
                    password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                showModal(
                    "error",
                    "Registration Failed",
                    Array.isArray(result.message)
                    ? result.message.join(", ")
                    : result.message || "Unable to create your account."
                );
                return;
            }

            showModal(
                "success",
                "Registration Successful",
                "Your VOLTRA account has been created successfully."
            );
            
        } catch (error) {
            showModal(
                "error",
                "Something Went Wrong",
                "Unable to connect to the server. Please try again."
            );
        }
    }

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 placeholder:text-white">
            <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button text="Register" />

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
                                router.push("/login");
                            }
                        }}
                            className={`mt-7 w-full rounded-xl px-4 py-3 font-semibold text-white duration-300 ${
                            modal.type === "success"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                        >
                            {modal.type === "success"
                            ? "Continue to Login"
                            : "Try Again"
                            }
                        </button>
                    </div>
                </div>,
                document.body
                )
            )}
        </form>
    );
}