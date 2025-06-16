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

### Retrieve recurring todos for day
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

Purpose: Retrieves all recurring todos for a specific day, pulling recurring todos that are daily, weekly, or monthly.