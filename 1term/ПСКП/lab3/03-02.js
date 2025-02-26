const express = require('express');

const app = express();
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
app.get('/fact', (req, res) => {
    const k = parseInt(req.query.k, 10);
    if (isNaN(k) || k < 0) { 
        return res.status(400).send('Некорректный параметр k');
    }
    
    const result = factorial(k);
    res.setHeader('Content-Type', 'text/plain'); 
    res.status(200).send(result.toString()); 
    
});

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

app.listen(3000);