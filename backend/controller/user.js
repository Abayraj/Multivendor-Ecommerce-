const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/User");
const { upload } = require("../multer");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err, "file error");
                    return res.status(500).json({ message: "Error deleting file" });
                }
            
            });

            return next(new ErrorHandler("User already exists", 400));
        }


        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        const user = {
            name: name,
            email: email,
            password: password,
            avatar: {
                url: fileUrl,
                public_id: filename,
            },
        };
        //activate user
        const activationToken = createActivationToken(user);
        const activationUrl = `http://localhost:3000/activation/${activationToken}`;
        console.log(user,"user data")

        try {

            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email - ${user.email} to activate your account!`,
                
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));

        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

//activate user
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activationToken } = req.body;

        const newUser = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
        if (!newUser) {
            return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, avatar } = newUser;
    const  user = await   User.create({
            name,
            email,
            avatar,
            password,
        });
        sendToken(user, 201, res)
    } catch (error) {
        return next(new ErrorHandler(error.message,500));

    }
}))

module.exports = router;
