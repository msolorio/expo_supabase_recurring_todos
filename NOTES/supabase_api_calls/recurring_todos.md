## Supabase API Calls

### Add recurring todo
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
Purpose: Creates a new recurring todo item in the database with specified details including recurrence settings.

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

### Add completed instance
```ts
const { data, error } = await supabase
  .from("recurring_todo_completed_instances")
  .insert({
    recurring_todo_id: recurringTodoId,
    date,
  })
  .select();
```

Purpose: Adds a completed instance of a recurring todo for a specific date.

