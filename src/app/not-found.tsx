import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center p-4">
            <div className="bg-container-primary flex max-w-md flex-col items-center justify-center gap-2 rounded-md p-4 text-center">
                <h1 className="text-error">Error 404</h1>
                <Image 
                    src="/not-found.jpg"
                    alt="Not found image"
                    width="300"
                    height="300"
                />
                <p>Sorry! This page does not exist.</p>
                <Link className="btn btn-primary" href="/">
                    Go Home
                </Link>
            </div>
        </div>
    );
}
