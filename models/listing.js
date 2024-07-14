const mongoose = require("mongoose");

//Schema
const listSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});

//model
const LIST = mongoose.model("list",listSchema);

module.exports = LIST;