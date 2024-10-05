const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/fact", (req, res) => {
  const k = parseInt(req.query.k, 10);
  if (isNaN(k) || k < 0) {
    return res.status(400).send("Некорректный параметр k");
  }

  factorial(k).then((result) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(result.toString());
  });
});

function factorial(n) {
  return new Promise((resolve, reject) => {
    if (n < 0) {
      reject(new Error("Факториал у отрицательного числа нельза высчитать"));
    }

    let result = 1;
    function calculateFactorial(num) {
      if (num === 0) {
        resolve(result);
      } else {
        result *= num;
        setImmediate(() => calculateFactorial(num - 1));
      }
    }
    calculateFactorial(n);
  });
}

app.listen(3000);
