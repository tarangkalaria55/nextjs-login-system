"use client";

import { SessionProvider } from "@/components/auth/session-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth/auth-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { isPending, data, error, refetch } = authClient.useSession();

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

  return (
    <SessionProvider session={data} refetch={refetch}>
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  );
}
