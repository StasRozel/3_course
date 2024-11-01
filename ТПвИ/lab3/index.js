const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
let count = 0;
app.use(cookieParser());

app.use(express.json());

app.post("/", (req, res) => {
  const cookieData = req.cookies.userData;
  ++count;
  let newCookie = {
    "sx": 0,
    "sy": 0,
  };
  if (cookieData == undefined || !(count % 6)) {
    res.cookie("userData", `${req.body.x} ${req.body.y} ${count}`);
    newCookie = {
      "sx": req.body.x,
      "sy": req.body.y,
    };
    console.log(newCookie);
  } else {
    console.log(cookieData);
    const numbers = cookieData.split(" ");
    let sx = Number(numbers[0]) + req.body.x;
    let sy = Number(numbers[1]) + req.body.y;
    newCookie = {
      "sx": sx,
      "sy": sy,
    };
    res.cookie("userData", `${newCookie.sx} ${newCookie.sy} ${count}`);
  }
  
  res.json(newCookie);
});

app.listen(3000);
