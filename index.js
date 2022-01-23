const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser")
const compression = require("compression");
const pool = require("./db.js");
const {response} =  require("express");

// middleware
app.use(cors());
// app.use(express.json());
app.use(compression());
app.use(bodyParser.json());

app.get("/", (request, response) =>{
    response.send("hello world");
});

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


app.listen(5000, () => {
    console.log("server started on 5000");
});