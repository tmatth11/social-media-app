import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@teispace/next-themes";
import Navbar from "./_components/navbar";
import { Geist } from "next/font/google";

const geist = Geist({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | Social Media App",
        default: "Social Media App",
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={geist.className} suppressHydrationWarning>
            <body className="bg-main dark:text-white min-h-dvh">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme={false}
                >
                    <Navbar />
                    <main className="flex-1">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
