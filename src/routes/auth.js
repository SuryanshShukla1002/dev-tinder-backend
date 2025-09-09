const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    // Validation of data is required
    try {
        validateSignUpData(req);
        // Encrypt the password

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        // Creating a new instance of the user model

        const savedUser = await user.save();
        const tokens = await savedUser.getJWT();
        // console.log(token)
        res.cookie("token", tokens, {
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.json({ message: "User added Successfully!", data: savedUser });
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Email id not present in Database");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const tokens = await user.getJWT();
            // console.log(token)
            res.cookie("token", tokens, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send(user);
        } else {
            throw new Error("Password is not correct");
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfull");
});

module.exports = authRouter;
