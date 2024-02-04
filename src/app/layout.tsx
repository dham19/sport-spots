import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./NextAuthProvider";
import Link from "next/link";
import SignOutButton from "./components/SignOutButton";

const inter = Inter({ subsets: ["latin"] });

// Set tab icon:
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png

export const metadata: Metadata = {
  title: "Sport Spots",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-black bg-white dark:text-white dark:bg-black`}
      >
        <NextAuthProvider>
          {/* Nav Bar */}
          <header className="flex justify-between h-20 mx-8 items-center">
            {/* Home logo */}
            <Link className="hover:cursor-pointer text-3xl font-bold" href="/">
              Sport Spots
            </Link>

            <SignOutButton />
          </header>

          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
