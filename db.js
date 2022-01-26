require("dotenv").config();
const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
const { emailValidation } = require("./validation");

const pool = new Pool ({
  user: "postgres",
  password: "Lunchbox",
  host: "localhost",
  port: 5432,
  database: "gamerating"
})


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
        // const {id} =request.params;
        const userFetch = await pool.query("SELECT * from users");

        response.json(userFetch.rows);
      }catch(err){
        console.error(err.message);
      }
  };

  const comments = async (request, response) => {
    try{
      const comList = await pool.query("SELECT * from comments");

      response.json(comList.rows);
    }catch(err){
      console.error(err.message);
    }
};

  const createComment = async (request, response) => {
    try {
      const {descript} = request.body;
      const addComment = await pool.query(
        "INSERT INTO comments (description) VALUES($1) RETURNING *",
        [descript]
      );
      response.json(addComment.rows[0]);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  };


  const deleteComment = async (request,response) => {
    try {
      const {id} = request.params
        const deleteComm = await pool.query("DELETE FROM comments WHERE id = $1", [id])
        response.json(deleteComm)
    } catch (err) {
      console.error(err.message)
    }
  }


  const updateComment= async (request,response) => {

    try
    {
        const {id} = request.params
        const {description} = request.body
        const updateCom = await pool.query("UPDATE comments SET description = $1 WHERE id = $2", [description,id])
        res.json("updated Comment")
    }
    catch (err)
    {
        console.error(err.message)
    }


}


module.exports = { createUser, loginUser, createComment, users , comments, deleteComment, updateComment};
