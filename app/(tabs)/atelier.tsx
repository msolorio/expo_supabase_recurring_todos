import { View, Text, StyleSheet, Button } from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/authContext";
import { Session } from "@supabase/supabase-js";

type OutfitCategory =
  | "GYM"
  | "WORK"
  | "CASUAL"
  | "EVENING"
  | "SPECIAL_OCCASION"
  | "VACATION";

type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type AddOutfitProps = {
  imageUrl: string;
  category: OutfitCategory;
  description: string;
};

type AssignOutfitForDayProps = {
  outfitId: string;
  dayOfWeek: DayOfWeek;
};

type FilterOutfitsProps = {
  category: OutfitCategory;
  searchText: string;
};

export default function atelier() {
  const { session } = useAuth() as unknown as { session: Session };

  const addOutfit = async ({
    imageUrl,
    category,
    description,
  }: AddOutfitProps) => {
    const { data, error } = await supabase
      .from("outfits")
      .insert([
        {
          user_id: session.user.id,
          image_url: imageUrl,
          category,
          description,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding outfit:", error);
      return;
    } else {
      console.log("Outfit added successfully:", data);
      return data;
    }
  };

  const assignOutfitForDay = async ({
    outfitId,
    dayOfWeek,
  }: AssignOutfitForDayProps) => {
    const { data, error } = await supabase
      .from("outfit_assignments")
      .insert([
        {
          outfit_id: outfitId,
          day_of_week: dayOfWeek,
        },
      ])
      .select();

    if (error) {
      console.error("Error assigning outfit for day:", error);
      return;
    } else {
      console.log("Outfit assigned for day successfully:", data);
      return data;
    }
  };

  const getOutfitsForDay = async ({ dayOfWeek }: { dayOfWeek: DayOfWeek }) => {
    const { data, error } = await supabase
      .from("outfits")
      .select(
        `
        id,
        image_url,
        category,
        description,
        outfit_assignments!inner()
      `
      )
      .eq("outfit_assignments.day_of_week", dayOfWeek)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error getting outfits for day:", error);
      return;
    } else {
      console.log("Outfits for day successfully:", data);
      return data;
    }
  };

  const getOutfitsForWeek = async () => {
    const { data, error } = await supabase
      .from("outfit_assignments")
      .select(
        `
          id,
          day_of_week,
          outfits (
            id,
            image_url,
            category,
            description
          )
        `
      )
      .eq("outfits.user_id", session.user.id);

    if (error) {
      console.error("Error getting outfits for week:", error);
      return;
    } else {
      console.log("Outfits for week successfully:", data);
      return data;
    }
  };

  const getAllOutfits = async () => {
    const { data, error } = await supabase
      .from("outfits")
      .select(
        `
          id,
          image_url,
          category,
          description
        `
      )
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error getting all outfits:", error);
      return;
    } else {
      console.log("All outfits successfully:", data);
      return data;
    }
  };

  const filterOutfits = async ({
    category,
    searchText,
  }: FilterOutfitsProps) => {
    let query = supabase
      .from("outfits")
      .select(
        `
          id,
          user_id,
          image_url,
          category,
          description
        `
      )
      .eq("user_id", session.user.id);

    if (category) {
      query = query.eq("category", category);
    }

    if (searchText) {
      query = query.ilike("description", `%${searchText}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error filtering outfits:", error);
      return;
    } else {
      console.log("Filtered outfits successfully:", data);
      return data;
    }
  };

  const uploadImage = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.mt20}>Atelier</Text>

      <Button
        title="Add an outfit"
        onPress={() =>
          addOutfit({
            imageUrl: "https://example.com/image.jpg",
            category: "GYM",
            description: "Description 1",
          })
        }
      />
      <Button
        title="Assign an outfit for a day"
        onPress={() =>
          assignOutfitForDay({
            outfitId: "1",
            dayOfWeek: "TUESDAY",
          })
        }
      />
      <Button
        title="Get outfits for a day"
        onPress={() =>
          getOutfitsForDay({
            dayOfWeek: "MONDAY",
          })
        }
      />
      <Button
        title="Get outfits for a week"
        onPress={() => getOutfitsForWeek()}
      />
      <Button title="Get all outfits" onPress={() => getAllOutfits()} />
      <Button
        title="Filter outfits"
        onPress={() =>
          filterOutfits({
            category: "GYM",
            searchText: "Description 1",
          })
        }
      />
      <Button title="Upload an image" onPress={() => uploadImage()} />
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
