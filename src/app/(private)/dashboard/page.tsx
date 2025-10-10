"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const logoutHandler = async () => {
    const { data, error } = await authClient.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      if (data.success) {
        toast.success("Logged out successfully");
        router.push("/sign-in");
      } else {
        toast.error("Try again");
      }
    }
  };

  return (
    <div>
      <Button onClick={logoutHandler}>Logout</Button>DashboardPage
    </div>
  );
}
