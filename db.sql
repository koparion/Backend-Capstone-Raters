CREATE DATABASE gamerating;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    joindate DATE NOT NULL 
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    stars INT NOT NULL,
    userfk INT,
    FOREIGN KEY (userfk) REFERENCES users(id)
);

CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    userfk INT,
    FOREIGN KEY (userfk) REFERENCES users(id),
    commentsfk INT,
    FOREIGN KEY (commentsfk) REFERENCES comments(id),
    gamesfk INT,
    FOREIGN KEY (gamesfk) REFERENCES games(id)
);

CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    games VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    reviews VARCHAR(255) NOT NULL,
    reviewsfk INT,
    FOREIGN KEY (reviewsfk) REFERENCES reviews(id)
);