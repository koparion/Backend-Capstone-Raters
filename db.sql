CREATE DATABASE gamerating;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    joindate DATE NOT NULL
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    currentUser VARCHAR(255) NOT NULL       --changeeedddddd @justin
);

CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    games VARCHAR(255) NOT NULL,
    image PATH,
    rating INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    -- reviewsfk INT,
    -- FOREIGN KEY (reviewsfk) REFERENCES reviews(id)
);