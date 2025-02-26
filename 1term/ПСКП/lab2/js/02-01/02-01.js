const express = require("express");

const app = express();

app.get("/html", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
    console.log("Server start on port 3000...");
});