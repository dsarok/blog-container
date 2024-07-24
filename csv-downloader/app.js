var express = require("express");
const client = require('prom-client')
const register = new client.Registry()

var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static('public'))
const db = require('./service/service').database
const obj1 = new db()
obj1.createConnection();

register.setDefaultLabels({
  app: 'example-nodejs-app'
})

client.collectDefaultMetrics({ register })

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/index");
});

// insert data
app.post("/", async function (req, res) {
  try {
    await obj1.addData(req.body.heading, req.body.body);
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

app.get('/blogs', function (req, res) {
    obj1.getAllData(res); 
})

app.get('/download/:id', (req,res)=>{
 obj1.streamData(req.params.id,res)
})

app.get('/metrics',async (req,res)=>{
  res.setHeader('Content-Type', register.contentType)
  const value = await register.metrics();
  res.send(value)
})
app.listen(8080);
console.log(new Date() + "restart 14 8080");
