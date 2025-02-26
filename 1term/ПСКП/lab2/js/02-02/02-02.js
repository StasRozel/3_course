const express = require("express");

const app = express();

app.get('/png', (req, res) => {
    res.sendFile(__dirname + "/pic.jpg")
})

app.listen(3000, () => {
    console.log("Server start on port 3000...");
})