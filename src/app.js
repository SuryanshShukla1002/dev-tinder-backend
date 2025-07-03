const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    // Creating a new instance of the user model
    await user.save();
    res.send("User Added Successfully!");

});

connectDB().then(() => {
    console.log("Database connection is successfull");
    app.listen(7777, () => {
        console.log("Server is successfully running on port 7777...");
    });
}).catch((error) => {
    console.log("Databse cannot be connected!");
});



