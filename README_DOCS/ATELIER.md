# Atelier
Documents atelier queries and database tables.

### Add an outfit
Creates a new outfit for the current user.
```ts
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
```

### Assign an outfit for a day
Assigns an outfit to a day of the week.
```ts
const { data, error } = await supabase
  .from("outfit_assignments")
  .insert([
    {
      outfit_id: outfitId,
      day_of_week: dayOfWeek,
    },
  ])
  .select();
```

### Get outfits for a day
Gets all outfits assigned to a day of the week.
```ts
const { data, error } = await supabase
  .from("outfits")
  .select(
    `
    id,
    user_id,
    image_url,
    category,
    description,
    outfit_assignments!inner()
  `
  )
  .eq("outfit_assignments.day_of_week", dayOfWeek)
  .eq("user_id", session.user.id);
```

### Get all outfits for the week
Gets outfit data for all outfit assignments.
```ts
    const { data, error } = await supabase
      .from("outfit_assignments")
      .select(
        `
          id,
          day_of_week,
          outfits (
            id,
            user_id,
            image_url,
            category,
            description
          )
        `
      )
      .eq("outfits.user_id", session.user.id);
```

### Get all outfits for the user
```ts
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
```

### Filter outfits
Filters outfits based on optional provided category and optionalsearch text.
```ts
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
```

### Tables for outfits
```sql
CREATE TYPE outfit_categopry AS ENUM (
    'GYM',
    'WORK', 
    'CASUAL',
    'EVENING',
    'SPECIAL_OCCASION',
    'VACATION'
);

-- Create the outfits table
CREATE TABLE outfits (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    category outfit_categopry NOT NULL,
    description TEXT
);
```

### Tables for outfit assignments
```sql
-- Create the DAY_OF_WEEK enum type
CREATE TYPE DAY_OF_WEEK AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);

-- Create the outfit_assignments table
CREATE TABLE outfit_assignments (
    id SERIAL PRIMARY KEY,
    outfit_id INT NOT NULL,
    day_of_week DAY_OF_WEEK NOT NULL,
    FOREIGN KEY (outfit_id) REFERENCES outfits(id)
);
```
