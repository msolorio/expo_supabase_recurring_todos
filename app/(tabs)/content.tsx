import { View, Text, Button, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
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

type UpdateContentItemCompletedProps = {
  contentItemId: string;
  completed: boolean;
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
      allowsMultipleSelection: false, // Can only select one image
      allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
      quality: 1,
      exif: false, // We don't want nor need that data.
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log("User cancelled image picker.");
      return;
    }

    const image = result.assets[0];
    console.log("Got image", image);

    if (!image.uri) {
      throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
    }

    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

    const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${Date.now()}.${fileExt}`;

    const { data: imageData, error: imageError } = await supabase.storage
      .from("content-images")
      .upload(path, arraybuffer, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    console.log("imageData", imageData);
    console.log("imageError", imageError);

    const { data, error } = await supabase
      .from("content_items")
      .insert([
        {
          user_id: session.user.id,
          post_title: postTitle,
          platform,
          post_date: postDate,
          image_url: imageData?.path ?? null,
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

  const updateContentItemCompleted = async ({
    contentItemId,
    completed,
  }: UpdateContentItemCompletedProps) => {
    const { data, error } = await supabase
      .from("content_items")
      .update({ completed: completed })
      .eq("id", contentItemId)
      .eq("user_id", session.user.id);
    // .select();

    if (error) {
      console.error("Error updating content item:", error);
      return;
    } else {
      console.log("Content item updated successfully:", data);
      return data;
    }
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
            postDate: "2025-01-01",
            inspiration: "snail",
            screenText: "pet snail",
            caption: "pet snail",
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
        onPress={() =>
          updateContentItemCompleted({
            contentItemId: "3",
            completed: true,
          })
        }
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
