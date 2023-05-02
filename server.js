var express = require("express");
var app = express();

const exphbs = require("express-handlebars") 

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://dbUser:moJKp0AagjHXATqv@cluster0.81qjyiq.mongodb.net/?retryWrites=true&w=majority");

const Schema = mongoose.Schema
const bookSchema = new Schema({author:String,title:String,borrowedBy:String,img:String,desc:String})
const userSchema = new Schema({cardNum:String})

const Users = mongoose.model("user_collection", userSchema) 
const Books = mongoose.model("book_collection", bookSchema)


const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  
   resave: false,
   saveUninitialized: true
}))

app.engine(".hbs",exphbs.engine({
  extname: ".hbs",
  helpers : {
    json: (context =>{return JSON.stringify(context)})
  }
}));
app.set("view engine",".hbs")
app.use(express.urlencoded({ extended: true }))
var HTTP_PORT = process.env.PORT || 8080;

const path = require("path")

app.get("/", async (req, res) => {
    books_list= await Books.find().lean()
    req.session.hasLoggedInUser = false
    res.render("home",{layout : false,bookList:books_list,isLogin:req.session.hasLoggedInUser})
})
app.get("/home.hbs", async (req, res) => {
  books_list= await Books.find().lean()
  res.render("home",{layout : false,bookList:books_list,isLogin:req.session.hasLoggedInUser})
})
app.get("/login.hbs", async (req, res) => {
    res.render("login",{layout : false,isLogin:req.session.hasLoggedInUser})
})
app.get("/profile.hbs", async (req, res) => {
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  if (req.session.hasLoggedInUser){
     res.render("profile",{layout:false,bookList:books_list})
  }
  else{
     res.render("error",{layout:false})
  }
})
app.post("/login", async (req, res) => {
    
    let findUser =await Users.findOne({cardNum:req.body.card})
    if (findUser === null){
      res.render("error",{layout:false})
    }
    else{
    books_list= await Books.find().lean()
    req.session.hasLoggedInUser = true
    req.session.currentUserCard= req.body.card
    res.render("home",{layout : false,bookList:books_list,isLogin:req.session.hasLoggedInUser})
    }
})
app.get("/logout", (req, res) => {
 
  req.session.destroy()

  res.render("login",{layout : false,isLogin:false,login:true})
})
//borrow
app.post("/borrow-01", async (req, res) => {
    let findBook = await Books.findOne({id:"01"})
    findBook.borrowedBy = req.session.currentUserCard
    await findBook.save()
    books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
    res.render("profile",{layout:false,bookList:books_list})
})
app.post("/borrow-02", async (req, res) => {
  let findBook = await Books.findOne({id:"02"})
  findBook.borrowedBy = req.session.currentUserCard
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
app.post("/borrow-03", async (req, res) => {
  let findBook = await Books.findOne({id:"03"})
  findBook.borrowedBy = req.session.currentUserCard
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
app.post("/borrow-04", async (req, res) => {
  let findBook = await Books.findOne({id:"04"})
  findBook.borrowedBy = req.session.currentUserCard
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
app.post("/borrow-05", async (req, res) => {
  let findBook = await Books.findOne({id:"05"})
  findBook.borrowedBy = req.session.currentUserCard
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
//remove
app.post("/return-01", async (req, res) => {
  let findBook = await Books.findOne({id:"01"})
  findBook.borrowedBy = null
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
app.post("/return-02", async (req, res) => {
  let findBook = await Books.findOne({id:"02"})
  findBook.borrowedBy = null
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
app.post("/return-03", async (req, res) => {
  let findBook = await Books.findOne({id:"03"})
  findBook.borrowedBy = null
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
app.post("/return-04", async (req, res) => {
  let findBook = await Books.findOne({id:"04"})
  findBook.borrowedBy = null
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})
app.post("/return-05", async (req, res) => {
  let findBook = await Books.findOne({id:"05"})
  findBook.borrowedBy = null
  await findBook.save()
  books_list= await Books.find({borrowedBy:req.session.currentUserCard}).lean()
  res.render("profile",{layout:false,bookList:books_list})
})



app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"))
})


app.get('/img/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(`img/${imageName}`, { root: __dirname });
});



function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


app.listen(HTTP_PORT, onHttpStart);