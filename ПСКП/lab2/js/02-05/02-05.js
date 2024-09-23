const express = require("express");

const app = express();

app.get('/fetch', (req, res) => {
    res.sendFile(__dirname + '/fetch.html');
})

app.get('/api/name', (req, res) => {
    res.setHeader("Context-Type", "text/plain");
    res.send('Розель Станислав Александрович');
})

app.listen(3000, () => {
    console.log('Server start on port 3000...');
})