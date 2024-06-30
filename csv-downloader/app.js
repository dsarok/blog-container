var express = require("express");
var app = express();
const mysql = require("mysql2");
var bodyParser = require("body-parser");

app.use(bodyParser.json());

let connection;
async function connect() {
  try {
    console.log("1st step");
    connection = mysql.createConnection({
      host: "mysql",
      user: "root",
      password: "root_password",
      port: 3306,
      database: "my_database",
    });
    connection.connect((err) => {
      if (err) {
        console.log("promlem in connecting");
        setTimeout(() => {
          console.log("reconnecting...");
          connect();
        }, 5000);
      }
      console.log("connected as id " + connection.threadId);

      // Execute the CREATE TABLE query
      connection.execute(
        "CREATE TABLE IF NOT EXISTS articles (id INT AUTO_INCREMENT PRIMARY KEY, heading TEXT NOT NULL, content TEXT NOT NULL)",
        (err, results, fields) => {
          if (err) {
            console.log("promlem in executing creating table article..");
            setTimeout(() => {
              console.log("re-executing...");
            }, 2000);
          } else {
            console.log("Table created or already exists.");
            console.log("Results: ", results);
            console.log("Fields: ", fields);
          }
        }
      );
    });

    console.log("2nd step");
  } catch (e) {
    console.error("this is the error", e);
    throw "error of this";
  }
}

async function createConnection() {
  try {
    await connect();
  } catch (e) {
    console.log(e, "reconnecting to the mysql database ..." );
    x++;
    setTimeout(createConnection, 5000);
  }
}
createConnection();
function addData(heading, body) {
  connection.connect((e) => {
    if (e) throw e;
    const query = `INSERT INTO articles (heading, content) VALUES (?, ?)`;

    connection.execute(query, [heading, body], (err, results, fields) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      console.log("Successfully inserted:", results);
    });
    // connection.end();
  });
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

app.get('/blogs',function (req,res) {
  res.render('pages/blogs')
})
app.listen(3000);
console.log(new Date() + "restart 14 3000");

// connection.end();
