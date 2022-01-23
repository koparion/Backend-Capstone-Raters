require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
    host: `${process.env.DB_HOST}`,
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    port: process.env.DB_PORT,
    database: `${process.env.DB_DATABASE}`
})

const createUser = async (request, response) => {
    try{
        const {username, firstname, lastname, password, email, country} = request.body;
        const newUser = await pool.query("INSERT INTO users (username, firstname, lastname, password, email, country) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [username, firstname, lastname, password, email, country]);
            response.json(newUser.rows[0]);
        }catch(err){
            response.status(500).json({error: err.message});
        }
    };

module.exports = {createUser};