import { Metadata } from "next";
import SignUpForm from "./_components/sign-up-form";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up using an email, username, display name, and password",
};

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center p-4">
            <SignUpForm />
        </div>
    );
}
