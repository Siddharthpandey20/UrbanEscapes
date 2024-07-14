const express = require("express");
const router = express.Router();
const REVIEW = require("../models/review")
const LIST = require("../models/listing")

router.post("/listing/:id",async(req,res)=>{
    const body = req.body;
    const listz = await LIST.findById(req.params.id);
    try{
        const review = await REVIEW.create({
            rating:body.rating,
            comment:body.comment,
            createdBy:req.user._id,
            listId: listz._id,
            createdAt:Date.now(),
        })
        return res.redirect(`/listing/${list._id}`)
    }catch(err){
        const reviews = await REVIEW.find({listId: req.params.id}).populate("createdBy")
        return res.render("listing",{
            listz,
            user:req.user,
            reviews,
            err:"Signin to submit a review"
        });
    }
})

router.delete("/listing/:listId/review/:reviewId", async (req, res) => {
    try {
        const review = await REVIEW.findByIdAndDelete(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.redirect(`/listing/${req.params.listId}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = router;