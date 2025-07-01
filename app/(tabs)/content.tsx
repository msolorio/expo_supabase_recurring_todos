import { View, Text, Button, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useAuth } from "../auth/authContext";

type Platform = "INSTAGRAM" | "YOUTUBE" | "TIKTOK";

type AddContentItemProps = {
  postTitle: string;
  platform: Platform;
  postDate: string;
  inspiration: string;
  screenText: string;
  caption: string;
};

type GetContentItemsForDayProps = {
  date: string;
};

type GetContentItemsForWeekProps = {
  startDate: string;
};

type GetContentItemsForMonthProps = {
  year: number;
  month: number;
};

export default function content() {
  const { session } = useAuth() as unknown as { session: Session };

  const addContentItem = async ({
    postTitle,
    platform,
    postDate,
    inspiration,
    screenText,
    caption,
  }: AddContentItemProps) => {
    const { data, error } = await supabase
      .from("content_items")
      .insert([
        {
          user_id: session.user.id,
          post_title: postTitle,
          platform,
          post_date: postDate,
          inspiration,
          screen_text: screenText,
          caption,
          completed: false,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding content item:", error);
      return;
    } else {
      console.log("Content item added successfully:", data);
      return data;
    }
  };

  const getContentItemsForDay = async ({
    date,
  }: GetContentItemsForDayProps) => {
    const { data, error } = await supabase
      .from("content_items")
      .select("post_title, platform, completed")
      .eq("user_id", session.user.id)
      .eq("post_date", date);

    if (error) {
      console.error("Error fetching content items:", error);
      return;
    }

    console.log("Content items for date:", date, data);
    return data;
  };

  const getContentItemsForWeek = async ({
    startDate,
  }: GetContentItemsForWeekProps) => {
    // Calculate the end date (7 days later, not including)
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const endDate = end.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("content_items")
      .select("post_title, platform, completed, post_date")
      .eq("user_id", session.user.id)
      .gte("post_date", startDate)
      .lt("post_date", endDate)
      .order("post_date", { ascending: true });

    if (error) {
      console.error("Error fetching content items for week:", error);
      return;
    }

    console.log("Content items for week starting:", startDate, data);
    return data;
  };

  const getContentItemsForMonth = async ({
    year,
    month,
  }: GetContentItemsForMonthProps) => {
    // Create start and end dates for the month
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0); // Last day of the month
    const endDateString = `${year}-${month
      .toString()
      .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("content_items")
      .select("post_title, platform, completed, post_date")
      .eq("user_id", session.user.id)
      .gte("post_date", startDate)
      .lte("post_date", endDateString)
      .order("post_date", { ascending: true });

    if (error) {
      console.error("Error fetching content items for month:", error);
      return;
    }

    console.log("Content items for month:", year, month, data);
    return data;
  };

  const editContentItem = async ({}) => {
    console.log("editContentItem");
  };

  const markContentItemCompleted = async ({}) => {
    console.log("markContentItemCompleted");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mt20}>Content</Text>

      <Button
        title="Add Content Item"
        onPress={() =>
          addContentItem({
            postTitle: "Post Title",
            platform: "INSTAGRAM",
            postDate: "2025-01-08",
            inspiration: "Inspiration",
            screenText: "Screen Text",
            caption: "Caption",
          })
        }
      />
      <Button
        title="View Content Items for Day"
        onPress={() => getContentItemsForDay({ date: "2025-01-01" })}
      />
      <Button
        title="View Content Items for Week"
        onPress={() => getContentItemsForWeek({ startDate: "2025-01-01" })}
      />
      <Button
        title="View Content Items for Month"
        onPress={() => getContentItemsForMonth({ year: 2025, month: 1 })}
      />
      <Button title="Edit Content Item" onPress={() => editContentItem({})} />
      <Button
        title="Mark Content Item Completed"
        onPress={() => markContentItemCompleted({})}
      />
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
