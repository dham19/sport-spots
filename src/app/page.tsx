"use client";

import { useSession, signIn } from "next-auth/react";
import HomePage from "./HomePage";
import { RotatingLines } from "react-loader-spinner";

export default function Home({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session && status === "authenticated" ? (
        <HomePage />
      ) : status === "loading" ? (
        <div className="m-auto">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Sport Spots</h1>

          <button
            className="btn-primary mt-20"
            onClick={() => signIn("google")}
          >
            Sign In
          </button>
        </div>
      )}
    </main>
  );
}
