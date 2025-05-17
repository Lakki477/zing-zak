
import { ReactNode, useEffect } from "react";
import { initAuth, useAuth } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { initialized } = useAuth();

  useEffect(() => {
    if (!initialized) {
      initAuth();
    }
  }, [initialized]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
