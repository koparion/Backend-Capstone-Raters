CREATE DATABASE gamerating;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    joindate DATE NOT NULL 
);

CREATE TABLE comments(
    comments_id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    stars int,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
);

CREATE TABLE reviews(
    reviews_id SERIAL PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (comments_id) REFERENCES comments(comments_id),
    FOREIGN KEY (games_id) REFERENCES games(games_id)
)

CREATE TABLE games(
    games_id SERIAL PRIMARY KEY,
    games VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    reviews VARCHAR(255) NOT NULL,
    FOREIGN KEY (reviews_id) REFERENCES reviews(reviews_id)
);