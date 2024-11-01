const express = require("express");
const session = require("express-session");

const app = express();
let count = 0;

app.use(session({
  secret: 'yourSecretKey',
  cookie: {}
}));

app.use(express.json());

app.post("/", (req, res) => {
  ++count;
  let newCookie = {
    "sx": 0,
    "sy": 0,
  };

  if (!req.session.userData || !(count % 6)) {
    req.session.userData = {
      x: req.body.x,
      y: req.body.y,
      count: count
    };
    newCookie = {
      "sx": req.body.x,
      "sy": req.body.y,
    };
  } else {
    console.log(req.session.userData);
    req.session.userData.x += req.body.x;
    req.session.userData.y += req.body.y;
    req.session.userData.count = count;

    newCookie = {
      "sx": req.session.userData.x,
      "sy": req.session.userData.y,
    };
  }

  
  res.json(newCookie);
});

app.listen(3000);