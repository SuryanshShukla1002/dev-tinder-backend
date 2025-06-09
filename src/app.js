const express = require('express');

const app = express();
// this will only get call to /user
app.get("/user");


app.use("/test", (req, res) => {
    res.send("Namaste from the dashBoard");
});

app.listen(7777, () => {
    console.log("Server is successfully running on port 7777...");
});
// start 42 min
