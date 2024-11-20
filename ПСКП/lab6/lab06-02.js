const express = require('express');
const { send } = require('./m0603');

const app = express();
const urlencodedParser = express.urlencoded({extended: false});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/sendmail.html');
})

app.post("/", urlencodedParser, (req, res)  => {
    if(!req.body) return res.sendStatus(400);
    send(req.body.from, process.env.PASSWORD_MAIL, req.body.message);
    console.log(req.body);
    res.send('Письмо отравленно');
})

app.listen(3000, () => {
    console.log('Server running on port 3000...');
})