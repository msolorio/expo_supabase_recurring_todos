# Expo Supabase Demo

Demonstrates Supabase integration with an Expo app.

## Setup

1. Ensure you have the Expo Go mobile app installed on your phone.
2. Clone the repository.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the Expo server.
5. Open up Expo Go on your phone and you should see an option to open the app.
  - If you don't see the option, you can scan the QR code with the Expo Go app to open the app.

## Supabase Integration
Clicking each of the buttons will trigger a Supabase API call to the Supabase backend and you can see the result of the queries logged in the console.

You can find the implementations in `/app/(tabs)/onetimetodos.tsx` and `/app/(tabs)/recurringtodos.tsx`.

## Supabase API Calls (queries)

The Supabase API calls / queries that can be made to the Supabase backend and the postgresql table creation statements.

[ATELIER](README_DOCS/ATELIER.md)

[TODOS](README_DOCS/TODOS.md)
