const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const alert=require("alert");
const { redirect } = require("statuses");


const app=express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


const about="Content to display";
const feedback="if you have any suggestion to improve this blog please do type ";
const homeContent="see all confessions your friends have made";

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/studentDB",{useNewUrlParser:true});

//create schema
const FriendSchema=new mongoose.Schema({
    name:String,
    Content:String
});

const userSchema=new mongoose.Schema({
    userName:String,
    userScholar:String
});



//create model
const Friend=mongoose.model("Friend",FriendSchema);
const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
res.render("about",{About:about});
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/signin",function(req,res){
    res.render("signin");
});

// app.get("/search/:type",function(req,res){
//     console.log(req.params.type);
//     const searchContent=req.params.type;
    
//     res.render("search");
// });
//when submit button get hit it will make a post request to register route
app.post("/register",function(req,res){
   const newUser=new User({
       userName:req.body.user,
       userScholar:req.body.scholar_no
   });
   newUser.save(function(err){
       if(err)
       {
           console.log(err);
       }
       else{
           console.log(newUser);
           res.render("main");
       }
   })
})
//creating post method for login route if user is found then  will be taken to the home page other wise asked to login
app.post("/signin",function(req,res){
    loginUser=req.body.user,
    loginScholar=req.body.scholar_no
    User.findOne({userName:loginUser},function(err,foundUser){
        if(err)
        {
            console.log(err);
        }
        else{
            if(foundUser)
            {
                if(foundUser.userScholar===loginScholar)
                {
                    res.render("main");
                }
            }
            else{
                res.render("nouser");
            }
        }
    })
});








app.get("/home",function(req,res){
    Friend.find({},function(err,posts){
        console.log(posts);
        res.render("home",{homeContent:homeContent,postarr:posts});
    })
   
   
});

app .get("/confess",function(req,res){
    
    res.render("confess");
});



app.get("/feedback",function(req,res){
    res.render("feedback",{Feedback:feedback});
});

// app.post("/",function(req,res){
//     console.log(req.body.user);
//      res.render("main");
    
// });

app.post("/friends",function(req,res){
    const friendspost=new Friend({
        name:req.body.frname,
        Content:req.body.describe,
    });
    console.log(req.body.frname);
    console.log(req.body.describe);
    
    friendspost.save(function(err)
    {
        if(!err)
        {
            res.redirect("/home");
        }
    })
   
})
// app.get("/logout",function(res,req){
//     res.redirect("/");
// })



app.listen(3000,function(req,res){
    console.log("server running at 3000");
})