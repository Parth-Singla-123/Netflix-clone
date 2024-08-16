import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Netflix",
  password: "Pa@220505",
  port: 5432,
});

app.use(express.static('public'));
app.use(express.static('views'));

app.listen(port,()=>{
    console.log(`listening to port: ${port}`);
})

app.get("/", (req, res) => {
  res.sendFile(__dirname+"/views/index.html");
});

let error;
app.get("/signin", (req, res) => {
    res.render("Netflix.ejs",{going:"Sign in",url:"signin",wrong:error});
  });

app.get("/signup",(req,res)=>{
  res.render("Netflix.ejs",{going:"Sign Up",url:"signup"});
});

db.connect();

app.post("/signup/submit",async (req,res) => {
  const usermail = req.body.email;
  const password = req.body.pass;
  try{
    await db.query("INSERT INTO login(email,pass) VALUES ($1,$2)",[usermail,password]);
    error="";
    res.redirect("/signin");
  } catch(err){
    console.log(err);
    res.render("Netflix.ejs",{going:"Sign Up",url:"signup",wrong:"User already exists"});
  }
  });


app.post("/signin/submit",async(req,res)=>{
  const usermail = req.body.email;
  const password = req.body.pass;
  try{
    const result = await db.query("SELECT email, pass FROM login WHERE email = $1",[usermail]);
    const data = result.rows[0];
    console.log(data.pass);
    console.log(password===data.pass);
    if(password===data.pass) {
      res.render("Home.ejs");
    }
    else{
      error = "Password incorrect";
      res.redirect("/signin");
    } 
  } catch(err){
    console.log(err);
    error = "Either password or email entered in incorrect";
    res.redirect("/signin");
  }
})