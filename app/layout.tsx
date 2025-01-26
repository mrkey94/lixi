import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const pacifico = Pacifico({
    subsets: ["vietnamese"],
    weight: ["400"],
    variable: "--font-pacifico",
});

export const metadata: Metadata = {
    title: "Lì xì túi mù",
    description: "Lì xì túi mù ngày Tết 2025",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
            >
                <main className="min-h-screen bg-gradient-to-br from-red-700 to-orange-600 relative overflow-hidden flex flex-col items-center justify-center">
                    {children}
                </main>
            </body>
        </html>
    );
}
