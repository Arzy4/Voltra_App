"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/button";
import Input from "../components/input";

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