require('dotenv').config()
const express = require("express");
const app = express();
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' data:; script-src 'self'; style-src 'self';");
    next();
});
const path = require("path")
const methodOverride = require("method-override");
const {checkAuthentication} = require("./middlewares/auth")
const cookieParser = require("cookie-parser")
//routes
const userRoute = require("./routes/user")
const listRoute = require("./routes/listing")
const reviewRoute = require("./routes/review")

//Imports
const {connectToMongoDB} = require("./connection")
const LIST = require("./models/listing")

//ConnectToMongoDB
connectToMongoDB(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Successfully Connected"))

//Setup EJS
app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

//middlewares
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'));
app.use(cookieParser())
app.use(checkAuthentication("token"));
app.use(express.static(path.resolve("./public")));

//Router
app.use("/user",userRoute)
app.use("/listing",listRoute);
app.use("/",reviewRoute)

app.get('/',async (req,res)=>{
    const allLists = await LIST.find({});
    return res.render("home",{
        lists:allLists,
        user:req.user,
    });
})

//SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>console.log(`Server Connected at PORT: ${PORT}`));