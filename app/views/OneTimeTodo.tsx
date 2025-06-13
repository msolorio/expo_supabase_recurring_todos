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

  async function editOneTimeTodo(
    todoId: number,
    updates: {
      title?: string;
      description?: string;
      category?: "CONTENT" | "ADMIN" | "PERSONAL";
      priority?: boolean;
    }
  ) {
    const { data, error } = await supabase
      .from("onetimetodoitem")
      .update(updates)
      .eq("id", todoId)
      .eq("user_id", session.user.id)
      .select();

    if (error) {
      console.error("Error updating todo:", error);
      return null;
    } else {
      console.log("Todo updated successfully:", data);
      return data;
    }
  }

  async function updateOneTimeTodoCompleted(
    todoId: number,
    completed: boolean
  ) {
    const { data, error } = await supabase
      .from("onetimetodoitem")
      .update({ completed })
      .eq("id", todoId)
      .eq("user_id", session.user.id)
      .select();

    if (error) {
      console.error("Error updating todo completed status:", error);
      return null;
    } else {
      console.log("Todo completed status updated successfully:", data);
      return data;
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

        <Button
          title="Edit one time todo"
          onPress={() => editOneTimeTodo(1, { title: "Updated Todooo" })}
        />

        <Button
          title="Update one time todo completed true"
          onPress={() => updateOneTimeTodoCompleted(1, true)}
        />

        <Button
          title="Update one time todo completed false"
          onPress={() => updateOneTimeTodoCompleted(1, false)}
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
