import React from "react";
import { Session } from "@supabase/supabase-js";
import { View, Text, StyleSheet, Button } from "react-native";
import { supabase } from "../lib/supabase";

export default function Home({ session }: { session: Session }) {
  console.log("session.user.id", session.user.id);

  async function addOneTimeTodo() {
    console.log("called addOneTimeTodo");

    const { data, error } = await supabase
      .from("onetimetodoitem")
      .insert({
        user_id: session.user.id,
        title: "Todo 3",
        description: "Description 3",
        category: "CONTENT",
        priority: true,
        date: new Date(),
      })
      .select();

    if (error) {
      console.error(error);
    } else {
      console.log("Todo added successfully", data);
    }
  }

  async function getTodosForDay(date: string) {
    const { data, error } = await supabase
      .from("onetimetodoitem")
      .select()
      .eq("user_id", session.user.id)
      .eq("date", date);

    if (error) {
      console.error(error);
    } else {
      console.log("Todos fetched successfully", data);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.mt20}>Home</Text>

        <Button title="Add one time todo" onPress={() => addOneTimeTodo()} />

        <Button
          title="Return todos for day"
          onPress={() => getTodosForDay("2025-06-12")}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
