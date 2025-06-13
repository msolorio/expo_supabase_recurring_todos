import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<{
  session: Session | null;
}>({
  session: null,
});

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
