# TODOs
Document todo queries and database tables.

### One Time Todos

#### Add one time todo
Creates a new one-time todo item in the database with specified details.
```ts
const { data, error } = await supabase
  .from("one_time_todo_items")
  .insert({
    user_id: session.user.id,
    title: "Todo 3",
    description: "Description 3",
    category: "CONTENT",
    priority: true,
    date: new Date(),
  })
  .select();
```

---

#### Get one time todos for specific day
Retrieves all one-time todo items for a specific date for the current user.
```ts
const { data, error } = await supabase
  .from("one_time_todo_items")
  .select()
  .eq("user_id", session.user.id)
  .eq("date", date);
```

---

#### Update one time todo
Updates specific fields of an existing one-time todo item while ensuring it belongs to the current user.
```ts
const { data, error } = await supabase
  .from("one_time_todo_items")
  .update(updates)
  .eq("id", todoId)
  .eq("user_id", session.user.id)
  .select();
```

---

#### Update todo completion status
Updates the completion status of a one-time todo item while ensuring it belongs to the current user.
```ts
const { data, error } = await supabase
  .from("one_time_todo_items")
  .update({ completed })
  .eq("id", todoId)
  .eq("user_id", session.user.id)
  .select();
```

--- 

### Recurring Todos

#### Add recurring todo
Creates a new recurring todo item in the database with specified details including recurrence settings.
```ts
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
```

Possible values for recurrence_type
- 'DAILY'
- 'WEEKLY'
- 'MONTHLY'
- 'WEEKENDS'

Possible values for recurrence_value
- 0 for daily
- 0-6 for weekly
- 1-31 for monthly
- 0 for weekends

---

#### Add completed instance for a recurring todo
Adds a completed instance of a recurring todo for a specific date.
```ts
const { data, error } = await supabase
  .from("recurring_todo_completed_instances")
  .insert({
    recurring_todo_id: recurringTodoId,
    date,
  })
  .select();
```


---

#### Retrieve recurring todos for day
Retrieves all recurring todos for a specific day.
```ts
const { data, error } = await supabase
  .from("recurring_todos")
  .select()
  .eq("user_id", session.user.id)
  .or(
    `recurrence_type.eq.DAILY,` +
      `and(recurrence_type.eq.WEEKLY,recurrence_value.eq.${dayOfWeekNum}),` +
      `and(recurrence_type.eq.MONTHLY,recurrence_value.eq.${dayOfMonth})`
  );
```
Pulls recurring todos with either
- recurrence type of 'DAILY'
- recurrence type of 'WEEKLY' and recurrence value matching the day of the week for the day
- recurrence type of 'MONTHLY' and recurrence value matching the day of the month for the day

---

#### Retrieve completed recurring todos for day
Retrieves instances where a todo has been completed for a specific date and for list of recurring todo ids.
```ts
const { data, error } = await supabase
  .from("recurring_todo_completed_instances")
  .select()
  .eq("date", date.toISOString().split("T")[0])
  .in("recurring_todo_id", recurringTodoIds);
```
---

## Database tables

This setup also involves setting up the PostgreSQL database tables with Supabase.

### Table for one time todo
```sql
CREATE TYPE category_enum AS ENUM ('CONTENT', 'ADMIN', 'PERSONAL');

CREATE TABLE one_time_todo_items (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description VARCHAR,
    category category_enum NOT NULL,
    priority BOOLEAN,
    date DATE NOT NULL
);
```

### Table for recurring todo
```sql
CREATE TYPE recurrence_type_enum AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'WEEKENDS');

CREATE TABLE recurring_todos (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description VARCHAR,
    category category_enum NOT NULL,
    priority BOOLEAN,
    recurrence_type recurrence_type_enum NOT NULL,
    recurrence_value INTEGER,
    
    -- Add check constraints for recurrence_value based on recurrence_type
    CONSTRAINT check_daily_recurrence 
        CHECK (recurrence_type != 'DAILY' OR recurrence_value = 0),
    
    CONSTRAINT check_weekly_recurrence 
        CHECK (recurrence_type != 'WEEKLY' OR (recurrence_value >= 0 AND recurrence_value <= 6)),
    
    CONSTRAINT check_monthly_recurrence 
        CHECK (recurrence_type != 'MONTHLY' OR (recurrence_value >= 1 AND recurrence_value <= 31))

    CONSTRAINT check_weekends_recurrence 
        CHECK (recurrence_type != 'WEEKENDS' OR recurrence_value = 0)
);

-- When recurrence_type is DAILY, recurrence_value must be 0
-- When recurrence_type is WEEKLY, recurrence_value must be 0-6
-- When recurrence_type is MONTHLY, recurrence_value must be 1-31
-- When recurrence_type is WEEKENDS, recurrence_value must be 0
```

### Table for recurring todo completed instances
```sql
CREATE TABLE recurring_todo_completed_instances (
    id SERIAL PRIMARY KEY,
    recurring_todo_id INTEGER NOT NULL REFERENCES recurring_todos(id) ON DELETE CASCADE,
    date_completed DATE NOT NULL,
    UNIQUE (recurring_todo_id, date_completed)
);
```

### Table for outfits
```sql
-- Create the OUTFIT_CATEGORY enum type
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
    image_url TEXT NOT NULL,
    category outfit_categopry NOT NULL,
    description TEXT
);
```