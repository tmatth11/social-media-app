import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@teispace/next-themes";
import Navbar from "./_components/navbar";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

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
            <body className="bg-main min-h-dvh dark:text-white">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme={false}
                >
                    <Navbar />
                    <main className="flex-1">
                        {children}
                        <Analytics />
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
