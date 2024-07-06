var express = require("express");

var app = express();
const fs = require('fs')
var bodyParser = require("body-parser");
app.use(bodyParser.json());

const db = require('./service/service').database
const obj1 = new db()
obj1.createConnection();

async function addData(heading, body) {
  const query = `INSERT INTO articles (heading, content) VALUES (?, ?)`;
  await obj1.pool.query(query, [heading, body]);
}


app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/index");
});

// insert data
app.post("/", async function (req, res) {
  try {
    await addData(req.body.heading, req.body.body);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});


// create blog page
app.get("/create", function (req, res) {
  res.render("pages/create");
});


// about page
app.get("/about", function (req, res) {
  res.render("pages/about");
});

app.get('/blogs', async function (req, res) {
  const data = await obj1.getAllData();
  res.render('pages/blogs', { data: data });
})

app.get('/download/:id', (req,res)=>{
 obj1.streamData(req.params.id,res)
})

app.listen(3000);
console.log(new Date() + "restart 14 3000");
