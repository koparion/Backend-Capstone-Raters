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
});

const createUser = async (request, response) => {
  try {
    const {
      username,
      firstname,
      lastname,
      password,
      email,
      country,
      joindate,
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
    response.status(200).json({ success: true });
    // response.redirect('/'); // redirecting to front page
  } catch (err) {
    console.error(err.message);
  }
};

  const users = async (request, response) => {
      try{
        const {id} =request.params;
        const userFetch = await pool.query("SELECT * from users", [id]);

        response.json(userFetch.rows);
      }catch(err){
        console.error(err.message);
      }
  };

  const createComment = async (request, response) => {
    try {
      const { description, stars, username} = request.body;
      const addComment = await pool.query(
        // "SELECT * FROM users where username=$1 && INSERT INTO comments(description, stars) VALUES ($1,$2) RETURNING *",
        // "SELECT * FROM users WHERE username=$1, comments.description AND comments.stars FROM comments JOIN description AND stars ON comments.description AND comments.stars = comments.userfk",
        "INSERT INTO comments(description, stars) VALUES ($1,$2) SELECT users.id = id JOIN userfk"
        [description, stars]
      );
      response.json(addComment.rows[0]);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  };


module.exports = { createUser, loginUser, createComment, users };
