var express = require("express");
var app = express();
const mysql = require("mysql2");
var bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let connection;
(() => {
  connection = mysql.createConnection({
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

      console.log("the table articles is presen in db");
    }
  );
})();

function addData(heading, body) {
  connection.query(
    "INSERT INTO articles (heading, body) VALUES (?, ?)",
    [heading, body],
    (err, results, fields) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      console.log("Inserted row:", results);
    }
  );
  return true;
}
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  var tagline =
    "No programming concept is complete without a cute animal mascot.";

  res.render("pages/index", {
    tagline: tagline,
  });
});
app.post("/", function (req, res) {
  console.log("posting data", req.body.heading, req.body.body);
  try {
    addData(req.body.heading, req.body.body);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});
app.get("/create", function (req, res) {
  res.render("pages/create");
});
// about page
app.get("/about", function (req, res) {
  res.render("pages/about");
});

app.listen(3000);
console.log(new Date() + "restart10 3000");

// connection.end();
