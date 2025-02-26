const express = require("express");
  const readline = require('readline');

  const app = express();
  // Создаем интерфейс для ввода/вывода
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const states = {
    norm: "norm",
    stop: "stop",
    idle: "idle",
    test: "test"
  }

  let globalAnswer = "norm";
  
  function askQuestion() {
    let buff = 'norm';
    buff = globalAnswer;
    rl.question(`${buff}-> `, (answer) => {
      if (answer.toLowerCase() === 'exit') {
        console.log('Выход...');
        rl.close();
      } else {
        if (states[answer]) {
          globalAnswer = answer;
        }
        
        console.log(`reg =${buff}-> ${answer}`);
        askQuestion();
      }
    });
  }
  
  askQuestion();

app.get('/', (req, res) => {
  res.send(`<h3>${globalAnswer}</h3>`);
})

app.listen(3000)