import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.static('views'));

app.listen(port,()=>{
    console.log(`listening to port: ${port}`);
})

app.get("/", (req, res) => {
  res.sendFile(__dirname+"/views/index.html");
});
var wron = "";
app.get("/signin", (req, res) => {
    res.render("Netflix.ejs",{wrong :wron});
  });

app.post("/submit",(req,res) => {
  if(req.body["email"]==="parthsingla@gmail.com" && req.body["pass"]==="1234") {
    res.send("<h1>Welcome To Netflix</h1>");
  }
  else{
    wron = "Either entered password or e-mail is incorrect";
    res.render("Netflix.ejs",{ wrong : wron});
  }
})