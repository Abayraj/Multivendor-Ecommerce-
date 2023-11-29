const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/User");
const {upload} = require("../multer");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");



router.post("/create-user",upload.single("file"), async(req,res,next)=>{
    const {name,email,password} = req.body;
    const userEmail = await User.findOne({email});

    if(userEmail){
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err,"file errorr")
                res.status(500).json({message:"Error deleting file "})
            }
            else{
                res.json({message:"File deleted successfully"})
            }
        })
        return next(new ErrorHandler("User already exists",400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const user ={
        name:name,
        email:email,
        password:password,
        avatar:{
            url:fileUrl,
            public_id:filename
        },
    };

    const newUser = await User.create(user);
    res.status(201).json({
        success:true,
        newUser,
    });
});
module.exports = router;