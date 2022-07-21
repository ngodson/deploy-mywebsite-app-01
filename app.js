require("dotenv").config()
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");
const nodemailer = require("nodemailer");
const flash = require("express-flash-messages");
const session = require('express-session');
const cookieParser = require('cookie-parser');







const app = express();
const port = process.env.PORT || 3000;
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser('NotSoSecret'));

app.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));

app.use(flash());



mongoose.connect(`mongodb+srv://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASS}@cluster0.xezhsc4.mongodb.net/${process.env.DB_MONGO_DATABASE}`, {useNewUrlParser: true})

const passwordSchema = new mongoose.Schema({
  password: String
})

// SCHEMA USED TO SAVE IMAGES

// const imageSchema = new mongoose.Schema({
//     image:
//     {
//         data: Buffer,
//         contentType: String
//     }
// });



const User = new mongoose.model("user",passwordSchema);

// const usePassword = new User({
//   password: "rangeSuccess"
// })
// usePassword.save()

// SET STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      fs.mkdir('./uploads/',(err)=>{
         cb(null, './uploads/');
    })
  }
,
    filename:(req,file,cb)=>{ 
      cb(null, Date.now().toString() +"--"+ file.originalname) 
    }
  })
 
var upload = multer({ storage: storage })

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.DB_MAIL_USERNAME,
    pass: process.env.DB_MAIL_PASSWORD,
    clientId: process.env.DB_OAUTH_CLIENTID,
    clientSecret: process.env.DB_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.DB_OAUTH_REFRESH_TOKEN
  }
});




app.get("/",(req,res)=>{
var today = new Date();
var year = today.getFullYear();

 res.render('hello', {year:year});
 })
 
app.post("/",(req,res)=>{
    
})


// BOTH GET AND POST WERE USED TO UPLOAD IMAGES TO MONGODB

// app.get("/contact",(req,res)=>{
//     var today = new Date();
// var year = today.getFullYear();
// res.render("contact" , {year: year})
// })

// app.post("/contact",upload.single("myImage"),(req,res)=>{

//   res.redirect("/contact")
    // const obj = {
    //   img: { 
    //     data: fs.readFileSync(path.join(__dirname +"/uploads/" +req.file.filename),utf-8),
    //     contentType: "file.doc"
    //   }
    // }

    // const newImage = new User({
    //   image:obj.img
    // })

    // newImage.save((err)=>{
    //   if(err){
    //     throw err
    //   }
    //   else{
    //     console.log("Succes")
    //   }
     
    // });
  
  
  // console.log(req.file);
    // res.send("uploaded successfully");
    
// })


app.post("/cvAcess",(req,res)=>{
  let pword = req.body.password
  
  let chk = User.findOne({password:pword}, function(err,data){
    if(err){
      console.log(err)
    }
    else {
      if(!data){
      req.flash("notify", "Wrong Password. Try Again.")
      res.redirect("/")
    }
    else {
      if(data){
    
        res.sendFile(__dirname +"/uploads/1658266187205--NNANYERUGO GODSONCV (9).pdf")
    }
  }
    }
  })
})



// USED TO VIEW ALL IMAGES FROM MONGODB.
  // 
  // User.find({}, (err, images) => {
  //   if (err) {
  //       console.log(err);
  //       res.status(500).send("An error occurred", err);
  //   } else {
  //       res.render("experience", {images: images});
  //   }
  // });


app.post("/cnt",(req,res)=>{

    const name = req.body.name;
   const email  = req.body.email;
   const message = req.body.message;
  
  // console.log(name)
  // console.log(email)
  // console.log(message)

  let mailOptions = {
    from: email,
    to: "johngods@gmail.com",
    subject: `My WebSite Message From: "${name}: "${email}"` ,
    text: message
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log(err);
      req.flash("notify","Message not sent. Check your internet.")
      res.redirect("/")
    } else {
      console.log("success")
      req.flash("notify", "Message Sent. You will receive a response soon.")
   res.redirect("/")
      // console.log("Email sent successfully");
      // res.send("Thank you. Sent.");
    }
  });
})






app.listen(port,function(){
 console.log("Server running on port: "+port);
})