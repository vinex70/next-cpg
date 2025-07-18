// components/Layout.tsx
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    title?: string;
    description?: string; // Tambahkan props description
}

const appName = process.env.NEXT_PUBLIC_APP_NAME || "App Default";

export default function Layout({
    children,
    title = "Dashboard",
    description = "Selamat datang di aplikasi kami.", // default desc
}: LayoutProps) {
    const fullTitle = `${appName} | ${title}`;

    return (
        <>
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={description} />
                <link rel="icon" href="/images/logo.png" />
            </Head>
            <Navbar />
            <main className="pt-20 px-6">{children}</main>
        </>
    );
}
