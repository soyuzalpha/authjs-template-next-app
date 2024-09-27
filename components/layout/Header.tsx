"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
// import { Avatar, AvatarImage } from "../ui/avatar";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();

  console.log({ session });

  if (!session || !session.user) return null;

  return (
    <header className="fixed top-0 left-0 w-full">
      <nav className="container mx-auto flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold">Auth.js</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <h1 className="hover:underline cursor-pointer font-semibold text-zinc-600">
              {session ? session?.user?.name : "GAK OKE"}
            </h1>
            <Image
              src={session?.user?.image ? session?.user?.image : "https://github.com/shadcn.png"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="rounded-full w-12"
            />
          </div>

          <Button
            type="submit"
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="bg-red-500 font-semibold hover:bg-red-600"
          >
            Log Out
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
