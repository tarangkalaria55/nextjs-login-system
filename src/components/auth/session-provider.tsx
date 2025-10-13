import React, { useContext } from "react";
import type { authClient } from "@/lib/auth/auth-client";

type UseSessionType = ReturnType<typeof authClient.useSession>;

type SessionContextType = {
  session: UseSessionType["data"];
  refetch: UseSessionType["refetch"];
};

const SessionContext = React.createContext<SessionContextType>({
  session: null,
  refetch: () => {},
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider = ({
  children,
  ...sessionValue
}: React.PropsWithChildren<SessionContextType>) => {
  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
};
