"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/components/auth/session-provider";
import { UserProfile } from "./user-profile";

export const Header = () => {
  const { session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="p-2 flex justify-between items-center">
      <Link href="/dashboard">
        <Image
          src="/next.svg"
          alt="Logo"
          width={0}
          height={0}
          className="dark:invert aspect-auto w-auto h-4"
        />
      </Link>
      <div className="flex items-center gap-4">
        <UserProfile
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? undefined,
          }}
        />
      </div>
    </div>
  );
};
