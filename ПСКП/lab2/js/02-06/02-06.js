const express = require("express");

const app = express();

app.get('/jquery', (req, res) => {
    res.sendFile(__dirname + '/jquery.html');
})

app.get('/api/name', (req, res) => {
    res.setHeader("Context-Type", "text/json");
    res.send('Розель Станислав Александрович');
})

app.listen(3000, () => {
    console.log('Server start on port 3000...');
})