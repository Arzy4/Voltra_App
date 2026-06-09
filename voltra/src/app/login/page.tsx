import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import Link from "next/link";

export default function login() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <Card>
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-text-primary">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-text-secondary">
                        Login now to book your next charging reservation.
                    </p>
                </div>

                <div className="space-y-4">
                    <Input type="email" placeholder="Email Address" />
                    <Input type="password" placeholder="Password" />

                    <Button text="Login" />
                </div>

                <p className="mt-6 text-center text-sm text-text-secondary">
                Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-primary-blue">
                        Register
                    </Link>
                </p>
            </Card>
        </main>
    )
}