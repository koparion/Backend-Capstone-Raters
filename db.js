require("dotenv").config();
const Pool = require("pg").Pool;
const bcrypt = require('bcrypt');

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