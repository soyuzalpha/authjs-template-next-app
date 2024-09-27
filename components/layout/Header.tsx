"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || !session.user) {
    return (
      <header className="fixed top-0 left-0 w-full">
        <nav className="container mx-auto flex items-center justify-between py-6">
          <h1 className="text-2xl font-bold">Auth.js</h1>

          <Button
            type="button"
            onClick={() => router.push("/signin")}
            className="bg-green-500 font-semibold hover:bg-green-600"
          >
            Sign In
          </Button>
        </nav>
      </header>
    );
  } else {
    return (
      <header className="fixed top-0 left-0 w-full">
        <nav className="container mx-auto flex items-center justify-between py-6">
          <h1 className="text-2xl font-bold">Auth.js</h1>
          <div className="flex items-center gap-6">
            <h1 className="hover:underline cursor-pointer font-semibold text-zinc-600">
              {session ? session?.user?.name : "GAK OKE"}
            </h1>

            <Button type="submit" onClick={() => signOut()} className="bg-red-500 font-semibold hover:bg-red-600">
              Log Out
            </Button>
          </div>
        </nav>
      </header>
    );
  }
};

export default Header;
