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

app.get("/");

app.listen(5000, () => {
    console.log("server started on 5000");
});