const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser")
const compression = require("compression");
const db = require("./db.js");
// const {response} =  require("express");

// middleware
app.use(cors());
// app.use(express.json());
app.use(compression());
app.use(bodyParser.json());

app.get("/", (request, response) =>{
    response.send("hello world");
});


app.post("/register", db.createUser); // creating user, function from db.js
app.post("/login", db.loginUser);

app.listen(5000, () => {
    console.log("server started on 5000");
});