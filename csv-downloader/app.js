var express = require("express");
var app = express();
const mysql = require("mysql2");
// set the view engine to ejs
app.set("view engine", "ejs");

// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  var tagline =
    "No programming concept is complete without a cute animal mascot.";

  res.render("pages/index", {
    tagline: tagline,
  });
});
app.get("/create", function (req, res) {
  res.render("pages/create");
});
// about page
app.get("/about", function (req, res) {
  res.render("pages/about");
});

app.listen(3000);
console.log("Server is listening on port 300");

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root_password",
  port: 3306,
  database: "my_database",
});
connection.connect();

connection.query(
  `CREATE TABLE IF NOT EXISTS articles 
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  heading TEXT NOT NULL,
  content TEXT NOT NULL
)`,
  (err, rows, fields) => {
    if (err) throw err;

    console.log("The solution is: ", rows);
  }
);

connection.end();
