BEGIN;

TRUNCATE 
  "alerts",
  "expenses",
  "income",
  "goals",
  "users";

INSERT INTO "users" ("id", "first_name", "last_name", "username", "email", "password", "allowance", "balance")
VALUES
  (
    1,
    'john',
    'smith',
    'js123',
    'notarealemail@notrealmail.com',
    --password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    51.21,
    1000.50 
  ),
  (
    2,
    'Jane',
    'Goodall',
    'realTarzan',
    'notarealemail@notrealmail.com',
    --password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    10000,
    100000 
  ),
  (
    3,
    'Chatchawan',
    'Suwaratana',
    'catLover27',
    'notarealemail@notrealmail.com',
    --password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    78.17,
    234.59 
  ),
  (
    4,
    'James',
    'Coffelt',
    'Big Papa',
    'notarealemail@notrealmail.com',
    --password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    562.94,
    600.59 
  ),
  (
    5,
    'Gage',
    'M',
    'sumDude',
    'notarealemail@notrealmail.com',
    --password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    292.78,
    304.27 
  ),
  (
    6,
    'Miki',
    'Francisco',
    'loveToCode',
    'notarealemail@notrealmail.com',
    --password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    847.68,
    902.68 
  ),
  (
    7,
    'Muhajir',
    'Sayer',
    'broke man',
    'notarealemail@notrealmail.com',
    --password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    18.72,
    29.27 
  );

INSERT INTO "goals" ("id", "user_id", "goal_amount", "contribution_amount", "current_amount", "end_date")
VALUES 
  (
    1,
    1,
    50,
    25,
    10.45,
    '2020-10-05'
  ),
  (
    2,
    2,
    1000,
    100,
    0,
    '2020-10-05'
  ),
  (
    3,
    3,
    100,
    50,
    0,
    '2020-10-05'
  ),
  (
    4,
    4,
    500,
    50,
    25,
    '2020-10-05'
  ),
  (
    5,
    5,
    250,
    100,
    0,
    '2020-10-05'
  ),
  (
    6,
    6,
    1000,
    200,
    100,
    '2020-10-05'
  ),
  (
    7,
    7,
    100,
    25,
    0,
    '2020-10-05'
  );

INSERT INTO "income" ("id", "user_id", "name", "income_amount", "income_category", "date_created")
VALUES  
  (
    1,
    2,
    'job',
    249.67,
    'paycheck',
    '2020-08-27'
  ),
  (
    2,
    1,
    'parents',
    113.88,
    'other',
    '2020-08-29'
  );

INSERT INTO "expenses" ("id", "user_id", "name", "expense_amount", "expense_category", "date_created")
VALUES  
  (
    1,
    2,
    'rent',
    -400,
    'bills',
    '2020-08-30'
  );

-- Because we explicitly set the id fields
-- Update the sequencer for future automatic id setting
SELECT setval('users_id_seq', (SELECT MAX(id) from users));
SELECT setval('goals_id_seq', (SELECT MAX(id) from goals));
SELECT setval('income_id_seq', (SELECT MAX(id) FROM income));
SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses));

COMMIT;