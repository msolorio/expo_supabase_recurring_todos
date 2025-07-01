# Content
Documents content queries and database tables.

### Add a content item
Creates a new content item for the current user.
```ts
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
Marks a content item as completed (placeholder function).
```ts
const markContentItemCompleted = async ({}) => {
  console.log("markContentItemCompleted");
};
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

