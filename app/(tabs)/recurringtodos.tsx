import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "../auth/authContext";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export default function RecurringTodos() {
  const { session } = useAuth() as unknown as { session: Session };
  console.log("session.user.id", session.user.id);

  return (
    <View style={styles.container}>
      <Text style={styles.mt20}>Recurring Todos</Text>

      <View>
        <Button title="Add recurring todo" onPress={() => {}} />
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
