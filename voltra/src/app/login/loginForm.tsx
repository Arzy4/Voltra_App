"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill in all fields!");
            return;
        }

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("No user found. Please register first.");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.email !== email || user.password !== password) {
            alert("Invalid email or password!");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Login successful!");
        router.push("/profilePage");
    }

    return(
        <form onSubmit={handleLogin} className="flex flex-col gap-4 placeholder:text-white">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"  
            />
            <button type="submit" className="bg-primary-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Login
            </button>
        </form>
    )
}