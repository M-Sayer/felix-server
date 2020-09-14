CREATE TABLE IF NOT EXISTS "goals" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"(id) 
    ON DELETE CASCADE NOT NULL,
  "goal_amount" NUMERIC(12,2) CHECK (goal_amount > 0) 
    DEFAULT 0 NOT NULL,
  "contribution_amount" NUMERIC(12,2) CHECK (contribution_amount > 0)
    DEFAULT 0 NOT NULL,
  "current_amount" NUMERIC(12,2) CHECK (current_amount >= 0)
    DEFAULT 0 NOT NULL,
  "end_date" DATE DEFAULT now() NOT NULL,
  "completed" BOOLEAN DEFAULT false NOT NULL,
  "date_created" TIMESTAMPTZ DEFAULT now() NOT NULL
);