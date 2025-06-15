-- Create One time todo table
-- links to user auth table

-- Create enum type for category
CREATE TYPE category_enum AS ENUM ('CONTENT', 'ADMIN', 'PERSONAL');

-- Create the one_time_todo_items table
CREATE TABLE one_time_todo_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description VARCHAR,
    category category_enum NOT NULL,
    priority BOOLEAN,
    date DATE NOT NULL
);