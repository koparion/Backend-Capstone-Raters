const express = require("express");
const exphbs = require('express-handlebars');
const path = require('path');
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
    response.send("hello world, database is connected");
});

app.post("/register", db.createUser); // creating user, function from db.js
app.post("/login/:username", db.loginUser); // login user
app.get("/users",db.users); // see all users
app.get("/user", db.user); // see one user

app.post("/comments", db.createComment); // add comment
app.get("/comments/:id", db.getOneComment);
app.get("/comments", db.getComment); // see all comment
app.delete("/comments/:id", db.deleteComment);
app.put("/comments/:id", db.updateComment);


app.post("/game", db.addGame); // add game to database
app.get("/games/:id", db.getGame); // see one game
app.get("/games", db.getAllGames); // see all games
// console.log(process.env.DATABASE_URL);


app.connect(process.env.DB_URL);

app.listen(process.env.PORT || 5000, () => {
    console.log("server started on 5000");
});
// app.connect(process.env.DB_URL, () => {
//     console.log("server started on 5000");
// });