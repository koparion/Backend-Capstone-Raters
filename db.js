require("dotenv").config();
const Pool = require("pg").Pool;
const bcrypt = require('bcrypt');
const {emailValidation} = require("./validation");

const pool = new Pool({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    port: process.env.DB_PORT,
    database: `${process.env.DB_DATABASE}`
})

const createUser = async (request, response) => {
    try{
        const {username, firstname, lastname, password, email, country, joindate} = request.body;
        //validating email
        if(!emailValidation(email)) {
            response.status(400).json({ error: "Email not valid" });
            return;
        }
        //checking if theres a duplicate email
        const emailDuped = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        if(emailDuped.rows.length > 0){
            response.status(400).json({ error: "Email already exists" });
            return;
        }
        const usernameDupe = await pool.query("SELECT * FROM users WHERE username = $1",[username]);
        if(usernameDupe.rows.length > 0){
            response.status(400).json({ error: "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10); // adding layer of security
        const hashedPassword = await bcrypt.hash(password,salt); // hashing the password
        const newUser = await pool.query("INSERT INTO users (username, firstname, lastname, password, email, country, joindate) VALUES ($1, $2, $3, $4, $5, $6, now()) RETURNING *",
        [username, firstname, lastname, hashedPassword, email, country]);
            response.json({success: true, data: newUser.rows[0]});
        }catch(err){
            response.status(500).json({error: err.message});
        }
    };

module.exports = {createUser};