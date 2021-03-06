CREATE TYPE income_type AS ENUM (
  'paycheck',
  'freelance',
  'side_gig',
  'other'
);

CREATE TABLE IF NOT EXISTS "income" (
  "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "user_id" INTEGER REFERENCES "users"(id) 
    ON DELETE CASCADE NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "income_amount" BIGINT CHECK (income_amount >= 0) 
    DEFAULT 0 NOT NULL,
  "income_category" income_type NOT NULL,
  "date_created" TIMESTAMPTZ DEFAULT now() NOT NULL
);