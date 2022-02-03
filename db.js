require("dotenv").config();
const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
const { emailValidation } = require("./validation");

const pool = new Pool({
  host: `${process.env.DB_HOST}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  port: process.env.DB_PORT,
  database: `${process.env.DB_DATABASE}`,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});
// create user
const createUser = async (request, response) =>{
  try {
    const {
      username,
      firstname,
      lastname,
      password,
      email,
      country,
      joindate
    } = request.body;
    //validating email
    if (!emailValidation(email)) {
      response.status(400).json({ error: "Email not valid" });
      return;
    }
    //checking if theres a duplicate email
    const emailDuped = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (emailDuped.rows.length > 0) {
      response.status(400).json({ error: "Email already exists" });
      return;
    }
    const usernameDupe = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (usernameDupe.rows.length > 0) {
      response.status(400).json({ error: "User already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10); // adding layer of security
    const hashedPassword = await bcrypt.hash(password, salt); // hashing the password
    const newUser = await pool.query(
      "INSERT INTO users (username, firstname, lastname, password, email, country, joindate) VALUES ($1, $2, $3, $4, $5, $6, now()) RETURNING *",
      [username, firstname, lastname, hashedPassword, email, country]
    );
    response.json({ success: true, data: newUser.rows[0] });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};

let currUser = "";
// login user
const loginUser = async (request, response) => {
  try {
    const { username, password } = request.body;

    const user = await pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    const match = await bcrypt.compare(password, user.rows[0].password);
    if (!match) {
      response.status(400).json({ error: "Password is incorrect" });
      return;
    }
    // response.json({success: true, data: user.rows[0]});
    currUser = user.rows[0].username;
    response.status(200).json({ success: true });
    // response.redirect('/'); // redirecting to front page
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// fetching all users
const users = async (request, response) => {
  try {
    const userFetch = await pool.query("SELECT * FROM users");
    // const userFetch = await pool.query("SELECT id, firstname, lastname, email, country, username, password, to_char(joindate, 'YYYY-MM-DD') as joindate FROM users");
    response.json(userFetch.rows);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// fetching one
const user = async (request, response) => {
  try {
    const { id } = request.params;
    const userFetch = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [id]
    );

    response.json(userFetch.rows);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// creating comment
const createComment = async (request, response) => {
  try {
    const { description } = request.body;
    const addComment = await pool.query(
      "INSERT INTO comments(description, currentUser, date) VALUES($1,$2,now()) RETURNING *",[
        description, currUser, date
      ]
    );
    // response.json(addComment.rows[0]);
    response.json(addComment.rows);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// fetching comments
const getComment = async (request, response) => {
  try {
    const comments = await pool.query("SELECT * FROM comments");
    response.json(comments.rows);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// fetch one comment
const getOneComment = async (request, response) => {
  try {
    const { id } = request.params;
    const getOne = await pool.query("SELECT * FROM comments WHERE id = $1", [
      id,
    ]);
    response.json(getOne.rows[0]);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// delete comment
const deleteComment = async (request, response) => {
  try {
    const { id } = request.params;
    const deleteRow = await pool.query("DELETE FROM comments WHERE id = $1", [
      id,
    ]);
    response.json("Row deleted");
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// update comment
const updateComment = async (request, response) => {
  try {
    const { id } = request.params;
    const { description } = request.body;
    const updateTable = await pool.query(
      "UPDATE comments SET description = $1 WHERE id = $2",
      [description, id]
    ); 
    response.json("table was updated");
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// adding games
const addGame = async (request, response) => {
  try {
    const { games, image, description, rating } = request.body;
    const addComment = await pool.query(
      "INSERT INTO games(games, image, description, rating ) VALUES ($1,$2,$3,$4) RETURNING *",
      [games, image, description, rating]
    );
    response.json(addComment.rows[0]);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// fetching one game based on id
const getGame = async (request, response) => {
  try {
    const { id } = request.params;
    const game = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
    response.json(game.rows[0]);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};
// fetching all games
const getAllGames = async (request, response) => {
  try {
    const game = await pool.query("SELECT * FROM games");
    response.json(game.rows);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  createComment,
  getOneComment,
  getComment,
  deleteComment,
  updateComment,
  user,
  users,
  addGame,
  getGame,
  getAllGames,
};
