const express = require("express");
const LIST = require("../models/listing");
const REVIEW = require("../models/review");
const router = express.Router();
const multer = require("multer");
const {cloudinary, storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/add-new",(req,res)=>{
    return res.render("addListing",{
        user:req.user,
    });
})

router.post("/add-new",upload.single("image"),async (req,res)=>{
    const body = req.body;
    const list = await LIST.create({
        title:body.title,
        desc:body.desc,
        price:body.price,
        location:body.location,
        country:body.country,
        image:`uploads/${req.file.filename}`,
        createdBy:req.user._id,
    })

    // return res.render("home",{
    //     success: "New list created",
    //     user:req.user,
    // })
    return res.redirect("/");
})

router.get("/:id",async (req,res)=>{
    const listz = await LIST.findById(req.params.id).populate("createdBy");
    const reviews = await REVIEW.find({listId: req.params.id}).populate("createdBy")
     return res.render("listing",{
        listz,
        user:req.user,
        reviews,
     })
})

router.delete("/:id", async (req, res) => {
    try {
        await LIST.findByIdAndDelete(req.params.id);
        await REVIEW.deleteMany({ listId: req.params.id });

        return res.redirect("/");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});

router.get("/:id/edit", async (req, res) => {
    try {
        const list = await LIST.findById(req.params.id);
        if (!list) {
            return res.status(404).send("Listing not found");
        }
        return res.render("edit", { list, user: req.user });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});

router.post("/:id/edit", upload.single("image"), async (req, res) => {
    try {
        const body = req.body;
        const updateData = {
            title: body.title,
            desc: body.desc,
            price: body.price,
            location: body.location,
            country: body.country,
            ...(req.file ? { image: `uploads/${req.file.filename}` } : {})
        };

        const list = await LIST.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!list) {
            return res.status(404).send("Listing not found");
        }

        return res.redirect(`/listing/${list._id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});


module.exports = router;