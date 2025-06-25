const express = require('express');
const connectDB = require("./config/database");
const app = express();

connectDB().then(() => {
    console.log("Database connection is successfull");
    app.listen(7777, () => {
        console.log("Server is successfully running on port 7777...");
    });
}).catch((error) => {
    console.log("Databse cannot be connected!");
});

// Start 20 min 


