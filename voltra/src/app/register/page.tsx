import Card from "../components/card";
import Input from "../components/input";
import Link from "next/link";
import RegisterForm from "./registerForm";

export default function register() {
    return(
        <main className="flex min-h-screen items-center justify-center px-6 text-white">
            <Card>
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm">
                        Join Voltra and start booking charging slots.
                    </p>
                </div>

                <div className="space-y-4 text-white">
                    <RegisterForm />
                </div>

                <p className="mt-6 text-center text-sm">
                Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-blue-500">
                        Login
                    </Link>
                </p>
            </Card>
        </main>
    )
}