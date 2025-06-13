import { useState, useEffect } from "react";
import { supabase } from "./app/lib/supabase";
import Auth from "./app/auth/Auth";
import OneTimeTodo from "./app/views/OneTimeTodo";
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
        <OneTimeTodo key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  );
}
