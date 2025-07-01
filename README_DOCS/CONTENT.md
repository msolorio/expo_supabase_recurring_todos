# Content
Documents content queries and database tables.

### Add a content item
This involves having the user select an image from their library and uploading it to Supabase storage.

```ts
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
```


Creates a new content item for the current user.

We take the image url from imageData.path and add it to the content item.
```ts
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
```

### Get content items for a day
Gets all content items for a specific date.
```ts
const { data, error } = await supabase
  .from("content_items")
  .select("post_title, platform, completed")
  .eq("user_id", session.user.id)
  .eq("post_date", date);
```

### Get content items for a week
Gets all content items for a week starting from a specific date.
```ts
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
```

### Get content items for a month
Gets all content items for a specific month and year.
```ts
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
```

### Edit content item
Updates an existing content item (placeholder function).
```ts
const editContentItem = async ({}) => {
  console.log("editContentItem");
};
```

### Mark content item completed
Marks a content item as completed.
```ts
const { data, error } = await supabase
  .from("content_items")
  .update({ completed: completed })
  .eq("id", contentItemId)
  .eq("user_id", session.user.id);
```

### Tables for content items
```sql
CREATE TYPE platform AS ENUM (
    'INSTAGRAM',
    'YOUTUBE',
    'TIKTOK'
);

-- Create the content_items table
CREATE TABLE content_items (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_title TEXT NOT NULL,
    platform platform NOT NULL,
    post_date DATE NOT NULL,
    inspiration TEXT,
    screen_text TEXT,
    caption TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

