const express = require('express');
const staticFileHandler = require('./m0701');

const app = express();

app.use('/', staticFileHandler('static'));
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('*', (req, res) => {
    res.status(404).send('File Not Found');
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
})