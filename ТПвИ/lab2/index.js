const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})

app.post('/sum-headers', (req, res) => {
    let num1 = Number(req.headers['x-value-x']);
    let num2 = Number(req.headers['x-value-y']);

    setTimeout(()=> {
        res.setHeader('X-Value-Z', num1 + num2);
    res.send('ok');
    res.end();
    }, 10_000);
})

app.post('/rand-header', (req, res) => {
    let numRandHeader = Number(req.headers['x-rand-n']);
    let numRand = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    let rowRandNumbers = generateRandomIntegers(numRandHeader, numRand);
    
    setTimeout(()=> {
        res.send({ row: rowRandNumbers })
    res.end();
    }, 1_000);
})

app.listen(3008, () => {
    console.log("Server started on port 3008...");
})


function generateRandomIntegers(n, count) {
    const randomIntegers = [];
    for (let i = 0; i < count; i++) {
        const randomInteger = Math.floor(Math.random() * (2 * n + 1)) - n;
        randomIntegers.push(randomInteger);
    }
    return randomIntegers;
}
