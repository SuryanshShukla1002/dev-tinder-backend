const express = require('express');

const app = express();

app.use((req, res) => {
    res.send("Hello server");
});

app.use("/", (req, res) => {
    res.send("Namaste from the dashBoard");
});

app.listen(3000, () => {
    console.log("Server is successfully running on port 3000...");
});
