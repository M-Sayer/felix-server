BEGIN;

TRUNCATE "users";

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

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('users_id_seq', (SELECT MAX(id) from users));

COMMIT;