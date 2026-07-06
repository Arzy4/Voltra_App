import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import Link from "next/link";
import LoginForm from "./loginForm";

export default function login() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6 text-white">
            <Card>
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm">
                        Login now to book your next charging reservation.
                    </p>
                </div>

                <div className="space-y-4">
                    <LoginForm />
                </div>

                <p className="mt-6 text-center text-sm">
                Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-blue-500">
                        Register
                    </Link>
                </p>
            </Card>
        </main>
    )
}