"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/button";
import Input from "../components/input";

export default function LoginForm() {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill in all fields!");
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
            alert(result.message || "Invalid email or password.");
            return;
            }

            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            if (result.user) {
            localStorage.setItem(
                "currentUser",
                JSON.stringify(result.user)
            );
            }

            alert("Login successful!");

            router.push("/stationPage");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Failed to login. Please try again.");
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

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button text="Login" />
        </form>
    )
}