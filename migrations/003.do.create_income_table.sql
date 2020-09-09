CREATE TYPE IF NOT EXISTS income_type AS ENUM (
    'investment_return',
    'fulltime_job',
    'part_time_job',
    'inheritance',
    'other'
);

CREATE TABLE IF EXISTS "income" (
    "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "user_id" INTEGER 
        REFERENCES "users"(id) ON DELETE CASCADE NOT NULL,
    "income_amount" NUMERIC(12,2) CHECK (income_amount >= 0) DEFAULT 0 NOT NULL,\
    "transaction_category" income_type NOT NULL,
    "date_created" DATE DEFAULT CURRENT_DATE NOT NULL
);