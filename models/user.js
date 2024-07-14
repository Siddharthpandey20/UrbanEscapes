const mongoose = require("mongoose");
const {createHmac, randomBytes} = require("crypto");
const {createTokenForUser} = require("../services/auth")

//Schema 
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
})

userSchema.pre("save",function(next){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt)
    .update(this.password)
    .digest("hex");

    this.salt = salt
    this.password = hashedPassword;

    return next();
})

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user = await USER.findOne({email});
    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password

    const hashedProvidedPassword = createHmac("sha256",salt)
    .update(password)
    .digest("hex")

     if(hashedProvidedPassword!==hashedPassword) throw new Error("Incorrect Password")
    
    const token = createTokenForUser(user);
    return token;
})

//model
const USER = mongoose.model("user",userSchema);

module.exports = USER;