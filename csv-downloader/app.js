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
  const query = "Select id, heading, content from articles";
  const data = await obj1.pool.query(query);
  res.render('pages/blogs', { data: data });
})

app.get('/download/:id',async (req,res)=>{
    const query = "Select * from articles where id = ?"
    const id = req.params.id;
    console.log('id is :',req.params.id)
    res.setHeader('Content-Disposition', 'attachment; filename="largefile.csv"');
    res.setHeader('Content-Type', 'text/plain');

    const data = await obj1.pool.query(query,[id])
    const titleKeys = Object.keys(data[0][0]);
    const refinedData = [];
    refinedData.push(titleKeys);
    refinedData.push(Object.values(data[0][0]));

    let csvContent="";
    refinedData.forEach(row => {
      csvContent += row.join(',') + '\n'
    })
    console.log(csvContent,'this is csv')
    fs.writeFileSync('largefile.csv',csvContent,(err)=>{
      console.log(err,'err is writing csv file')
    })

  const readStream = fs.createReadStream('./largefile.csv');
  readStream.pipe(res);
})

app.listen(3000);
console.log(new Date() + "restart 14 3000");
