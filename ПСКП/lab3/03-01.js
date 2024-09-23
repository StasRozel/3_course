const express = require("express");
const readline = require("readline");

const app = express();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Запрашиваем ввод пользователя
  rl.question('Введите что-то: ', (answer) => {
    console.log(`Вы ввели: ${answer}`);
    
    // Закрываем интерфейс после получения ввода
    rl.close();
  });

app.get('/', (req, res) => {

})

app.listen(3000, () => {
    console.log("Server start on port 3000...")
})