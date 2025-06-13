## Supabase API Calls

### Add one time todo
```ts
const { data, error } = await supabase
  .from("onetimetodoitem")
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
Purpose: Creates a new one-time todo item in the database with specified details.

### Get todos for specific day
```ts
const { data, error } = await supabase
  .from("onetimetodoitem")
  .select()
  .eq("user_id", session.user.id)
  .eq("date", date);
```
Purpose: Retrieves all todo items for a specific date for the current user.

### Update one time todo
```ts
const { data, error } = await supabase
  .from("onetimetodoitem")
  .update(updates)
  .eq("id", todoId)
  .eq("user_id", session.user.id)
  .select();
```
Purpose: Updates specific fields of an existing todo item while ensuring it belongs to the current user.

### Update todo completion status
```ts
const { data, error } = await supabase
  .from("onetimetodoitem")
  .update({ completed })
  .eq("id", todoId)
  .eq("user_id", session.user.id)
  .select();
```
Purpose: Updates the completion status of a todo item while ensuring it belongs to the current user.


