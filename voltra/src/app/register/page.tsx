import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import Link from "next/link";

export default function register() {
    return(
        <main className="flex min-h-screen items-center justify-center px-6">
            <Card>
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-text-primary">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm text-text-secondary">
                        Join Voltra and start booking charging slots.
                    </p>
                </div>

                <div className="space-y-4">
                    <Input type="text" placeholder="Full Name" />
                    <Input type="email" placeholder="Email Address" />
                    <Input type="text" placeholder="Phone Number" />
                    <Input type="password" placeholder="Password" />
                    <Input type="password" placeholder="Confirm Password" />

                    <Button text="Register" />
                </div>

                <p className="mt-6 text-center text-sm text-text-secondary">
                Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-primary-blue">
                        Login
                    </Link>
                </p>
            </Card>
        </main>
    )
}