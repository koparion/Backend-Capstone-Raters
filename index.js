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
    response.send("hello world, database is connected");
});


app.post("/register", db.createUser); // creating user, function from db.js
app.post("/login", db.loginUser); // login user
app.post("/comments", db.createComment);
// app.get("/comments/:id", db.userComments);
app.get("/users",db.users);

// console.log(process.env.DATABASE_URL);

app.listen(process.env.PORT || 5000, () => {
    console.log("server started on 5000");
});
app.connect(process.env.DB_URL, () => {
    console.log("server started on 5000");
});