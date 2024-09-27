"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const Page = () => {
  const { data: session } = useSession();

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center space-x-4 p-4">
          <div className="w-16 h-16">
            <Image
              src={session?.user?.image ? session?.user?.image : "https://github.com/shadcn.png"}
              alt="Profile Picture"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
            <p className="text-gray-600">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
