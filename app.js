const express= require('express');
const app= express();
const userModel = require("./models/user");

const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt');
const path= require('path');

const jwt = require('jsonwebtoken');
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render('index');
});
app.post('/create',async(req,res)=>{
    let {username,email,password,age}=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        
        bcrypt.hash(password,salt, async(err,hash)=>{
            let createdUser =await userModel.create({
                username,
                email,
                password: hash,
                age 
            })

            let token = jwt.sign({email},"shhhhhhhhhhh");
            res.cookie("token")
        res.send(createdUser);
            
        });
    })
    
    
});
app.post("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/");

})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login", function(req,res){
    let user =userModel.findOne({email:req.body.email})
    if(!user) return res.send("Something is wrong");

    bcrypt.compare(req.body.password,function(err,result){
        if(result) { 
            let token = jwt.sign({email:user.email},"shhhhhhhhhhh");
            res.cookie("token")
            res.send("Yes you can login");
        
        }
        else res.send("No you cannot login");
})
});

app.listen(3000);