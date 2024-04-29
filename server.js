const express = require("express");
const cors = require("cors");
const path = require("path");
const e = require("express");
const multer = require("multer");
const upload = multer();
const mysql = require("mysql");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
const port = 5000;
//dg
const db = require('./server_config');

app.get("/getUsers", (req, res) => {
  const sql = "SELECT * FROM `users`";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});


app.listen(port, () => {
    console.log("Server started on port"+port);
  });