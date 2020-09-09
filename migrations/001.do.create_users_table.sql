CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "date_created" TIMESTAMP DEFAULT now() NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "allowance" NUMERIC(12,2) CHECK( allowance >= 0) DEFAULT 0 NOT NULL ,
    "balance" NUMERIC(12,2) CHECK( balance >= 0) DEFAULT 0 NOT NULL 
);