"use client";

import { useRouter } from "next/navigation";
import { SessionProvider } from "@/components/auth/session-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { authClient } from "@/lib/auth/auth-client";
import { Header } from "./_components/header";

export default function PrivateLayout({ children }: LayoutProps<"/">) {
  const { isPending, data, error, refetch } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-2 flex justify-between items-center">
        Error: {error.message}
      </div>
    );
  }

  if (!data) {
    router.push("/auth/login");
    return;
  }

  return (
    <SessionProvider session={data} refetch={refetch}>
      <div className="min-h-screen w-full bg-muted">
        <Header />
        {children}
      </div>
    </SessionProvider>
  );
}
