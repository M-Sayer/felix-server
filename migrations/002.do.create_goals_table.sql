CREATE TABLE IF NOT EXISTS "goals" (
  "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "user_id" INTEGER 
    REFERENCES "users"(id) ON DELETE CASCADE NOT NULL,
  "goal_amount" NUMERIC(12,2) CHECK (goal_amount > 0 ) NOT NULL,
  "end_date" DATE NOT NULL ,
  "current_amount" NUMERIC(12,2) CHECK (current_amount >= 0 ) DEFAULT 0 NOT NULL,
  "completed" BOOLEAN DEFAULT false NOT NULL
);