CREATE TYPE expense_type AS ENUM (
  'bills',
  'transportation',
  'food',
  'entertainment',
  'other'
);

CREATE TABLE IF NOT EXISTS "expenses"(
  "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "user_id" INTEGER 
      REFERENCES "users"(id) ON DELETE CASCADE NOT NULL,
  "expense_amount" NUMERIC(12,2) CHECK (expense_amount <= 0) DEFAULT 0 NOT NULL,
  "expense_category" expense_type NOT NULL,
  "date_created" TIMESTAMP DEFAULT now() NOT NULL
);