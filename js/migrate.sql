CREATE TABLE IF NOT EXISTS texts (
    kmom VARCHAR(25) NOT NULL,
    content VARCHAR(20000) NOT NULL,
    UNIQUE(kmom)
);


CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(username)
);