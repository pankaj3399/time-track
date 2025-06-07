import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { redirect } from "next/navigation";

import { Providers } from "../providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
// import { Navbar } from "@/components/navbar";
import PrivateNavbar from "@/components/Navbar/PrivateNavbar";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  return (
    <>
      <PrivateNavbar />
      <main className="container mx-auto max-w-7xl flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3" />
    </>
  );
}
