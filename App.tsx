import { useState, useEffect } from "react";
import { supabase } from "./app/lib/supabase";
import Auth from "./app/auth/Auth";
import Home from "./app/views/Home";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <View>
      {session && session.user ? (
        <Home key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  );
}
