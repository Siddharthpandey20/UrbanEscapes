const mongoose = require("mongoose");

//Schema
const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    listId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"list",
    },
    createdAt:{
        type:Date,
    }
},{timestamps:true});

//model
const REVIEW = mongoose.model("review",reviewSchema);

module.exports = REVIEW;