import { View, Text, StyleSheet } from "react-native";

export default function RecurringTodos() {
  return (
    <View style={styles.container}>
      <Text>Recurring Todos</Text>
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
