"use client";

import Image from "next/image";
import Link from "next/link";
import UserProfile from "./user-profile";

const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  image: "https://github.com/shadcn.png",
};

export const Header = () => (
  <div className="bg-primary dark:bg-slate-700 py-2 px-5 flex justify-between items-center">
    <Link href="/">
      <Image src="/logo.png" alt="Logo" width={40} height={40} />
    </Link>
    <div className="flex items-center gap-4">
      <UserProfile user={user} />
    </div>
  </div>
);
