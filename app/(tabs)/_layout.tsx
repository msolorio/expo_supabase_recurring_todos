import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
// import Auth from "../auth/Auth";
// import { View } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function TabLayout() {
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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#aad33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="onetimetodos"
        initialParams={{ session: session }}
        options={{
          title: "One Time Todos",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "information-sharp" : "information-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}
