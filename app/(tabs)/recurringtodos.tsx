import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "../auth/authContext";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

const DaysOfWeek: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export default function RecurringTodos() {
  const { session } = useAuth() as unknown as { session: Session };
  console.log("session.user.id", session.user.id);

  async function addRecurringTodo({
    title,
    description,
    category,
    priority,
    recurrence_type,
    recurrence_value,
  }: {
    title: string;
    description?: string;
    category: "CONTENT" | "ADMIN" | "PERSONAL";
    priority: boolean;
    recurrence_type: "DAILY" | "WEEKLY" | "MONTHLY";
    recurrence_value: number;
  }) {
    const { data, error } = await supabase
      .from("recurring_todos")
      .insert({
        user_id: session.user.id,
        title,
        description,
        category,
        priority,
        recurrence_type,
        recurrence_value,
      })
      .select();

    if (error) {
      console.error("Error adding recurring todo:", error);
      return null;
    } else {
      console.log("Recurring todo added successfully:", data);
      return data;
    }
  }

  async function addRecurringTodoCompletedInstance({
    recurringTodoId,
    date,
  }: {
    recurringTodoId: number;
    date: Date;
  }) {
    const { data, error } = await supabase
      .from("recurring_todo_completed_instances")
      .insert({
        recurring_todo_id: recurringTodoId,
        date,
      })
      .select();

    if (error) {
      console.error("Error adding completed instance:", error);
      return null;
    } else {
      console.log("Completed instance added successfully:", data);
      return data;
    }
  }

  async function getRecurringTodosForDay({
    dayOfWeek,
    dayOfMonth,
  }: {
    dayOfWeek: DayOfWeek;
    dayOfMonth: number;
  }) {
    const dayOfWeekNum = DaysOfWeek.indexOf(dayOfWeek);

    const { data, error } = await supabase
      .from("recurring_todos")
      .select()
      .eq("user_id", session.user.id)
      .or(
        `recurrence_type.eq.DAILY,` +
          `and(recurrence_type.eq.WEEKLY,recurrence_value.eq.${dayOfWeekNum}),` +
          `and(recurrence_type.eq.MONTHLY,recurrence_value.eq.${dayOfMonth})`
      );

    if (error) {
      console.error("Error getting todos for day:", error);
      return null;
    } else {
      console.log("Todos for day:", data);
      return data;
    }
  }

  async function getCompletedRecurringTodosForDay({
    date,
    recurringTodoIds,
  }: {
    date: Date;
    recurringTodoIds: number[];
  }) {
    const { data, error } = await supabase
      .from("recurring_todo_completed_instances")
      .select()
      .eq("date", date.toISOString().split("T")[0])
      .in("recurring_todo_id", recurringTodoIds);

    if (error) {
      console.error("Error getting completed todos for day:", error);
      return null;
    } else {
      console.log("Completed todos for day:", data);
      return data;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mt20}>Recurring Todos</Text>

      <View>
        <Button
          title="Add recurring todo"
          onPress={() => {
            addRecurringTodo({
              title: "Test",
              description: "Test",
              category: "CONTENT",
              priority: false,
              recurrence_type: "WEEKLY",
              recurrence_value: 1,
            });
          }}
        />
        <Button
          title="Add completed instance"
          onPress={() => {
            addRecurringTodoCompletedInstance({
              recurringTodoId: 1,
              date: new Date("2025-06-16"),
            });
          }}
        />
        <Button
          title="Get todos for day"
          onPress={() => {
            getRecurringTodosForDay({
              dayOfWeek: "MONDAY",
              dayOfMonth: 16,
            });
          }}
        />
        <Button
          title="Get completed todos for day"
          onPress={() => {
            getCompletedRecurringTodosForDay({
              date: new Date("2025-06-16"),
              recurringTodoIds: [1],
            });
          }}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 40,
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
