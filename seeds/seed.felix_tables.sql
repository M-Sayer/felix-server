BEGIN;

TRUNCATE 
    "goals",
    "users";

INSERT INTO "users" ("first_name", "last_name", "username", "email", "password", "allowance", "balance")
VALUES
    (
        'foo',
        'bar',
        'admin',
        'notarealemail@notrealmail.com',
        --password = "pass"
        '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
        51.21,
        1000.50 
    );

INSERT INTO "goals" ("user_id","goal_amount","end_date","current_amount")
VALUES 
    (
        1,
        49.99,
        '2020-10-05',
        10.45
    );

INSERT INTO "income"("user_id","income_amount","transaction_category","date_created")
VALUES  
    (
        1,
        249.67,
        'fulltime_job',
        '2020-08-27'
    ),
    (
        1,
        113.88,
        'other',
        '2020-08-29'
    );

INSERT INTO ""("user_id","expenses_amount","expense_category")
VALUES  
    (

    );

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('users_id_seq', (SELECT MAX(id) from users));
SELECT setval('goals_id_seq', (SELECT MAX(id) from goals));
SELECT setval('income_id_seq', (SELECT MAX(id) FROM income));
SELECT setval('', (SELECT MAX(id) FROM __));

COMMIT;