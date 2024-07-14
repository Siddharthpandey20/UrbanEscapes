const express = require("express");
const router = express.Router();
const USER = require('../models/user');

//signup
router.get("/signup",(req,res)=>{
    return res.render("signup",{
        user:req.user,
    })
})

router.post("/signup",async (req,res)=>{
    const body = req.body;
    try{
        const user = await USER.create({
            userName:body.userName,
            email:body.email,
            password:body.password,
        })
    
        return res.redirect("/");
    }catch(err){
        return res.render("signup",{
            error:"User Email already Exists"
        });
    }
})

//signin
router.get("/signin",(req,res)=>{
    return res.render("signin",{
        user:req.user,
    });
})

router.post("/signin",async (req,res)=>{
    const {email,password} = req.body;
    try{
        const token = await USER.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect("/")
    }catch(err){
        return res.render("signin",{
            error:"Incorrect Password or Email",
        })
    }
})

//logout
router.get("/logout",(req,res)=>{
    return res.clearCookie("token").redirect("/");
})

module.exports = router;

