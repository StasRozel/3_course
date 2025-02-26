import express from "express";
import Database from "./db.js";
import Statistics from "./statistics.js";
import readline from 'readline';

const app = express();

app.use(express.json());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let statistics = new Statistics();
let shutdownTimeout = null;
let commitInterval = null;
let statsTimeout = null;
let requestCount = 0;
let commitCount = 0;

function commit() {
    console.log('commit');
    
}

// Функция для завершения работы сервера
function scheduleShutdown(seconds) {
    if (shutdownTimeout) {
        shutdownTimeout.unref();
        console.log('Предыдущее завершение отменено.');
    }
    if (seconds !== undefined) {
        shutdownTimeout = setTimeout(() => {
            console.log('Сервер завершает работу.');
            process.exit(0);
        }, seconds * 1000);
        console.log(`Сервер завершит работу через ${seconds} секунд.`);
    } else {
        console.log('Завершение работы отменено.');
    }
}

// Функция для периодической фиксации состояния БД
function scheduleCommit(seconds) {
    if (commitInterval) {
        commitInterval.unref();
        console.log('Предыдущее периодическое commit отменено.');
    }
    if (seconds !== undefined) {
        commitInterval = setInterval(() => {
            commit();
            statistics.commitCount = 0;
        }, seconds * 1000);
        console.log(`Commit будет выполняться каждые ${seconds} секунд.`);
    } else {
        console.log('Периодическое выполнение commit остановлено.');
    }
}

// Функция для сбора статистики
function scheduleStats(seconds) {
    if (statsTimeout) {
        clearTimeout(statsTimeout);
        console.log('Предыдущее собрание статистики отменено.');
    }
    if (seconds !== undefined) {
        statistics.init();
        statsTimeout = setTimeout(() => {
            console.log(statistics.close());
        }, seconds * 1000);
        console.log(`Сбор статистики начат на ${seconds} секунд.`);
    } else {
        console.log(statistics.close());
        console.log('Сбор статистики остановлен.');
    }
}

// Обработка ввода команд
rl.on('line', (input) => {
    const [command, arg] = input.trim().split(' ');

    switch (command) {
        case 'sd':
            scheduleShutdown(arg !== undefined ? parseInt(arg, 10) : undefined);
            break;
        case 'sc':
            scheduleCommit(arg !== undefined ? parseInt(arg, 10) : undefined);
            break;
        case 'ss':
            scheduleStats(arg !== undefined ? parseInt(arg, 10) : undefined);
            break;
        default:
            console.log('Неизвестная команда.');
            break;
    }
});

const DB = new Database([
  { id: 1, name: "Alice", bday: "1990-01-15" },
  { id: 2, name: "Bob", bday: "1985-03-22" },
  { id: 3, name: "Charlie", bday: "1992-07-09" },
  { id: 4, name: "David", bday: "1988-11-30" },
  { id: 5, name: "Eva", bday: "1995-05-14" },
  { id: 6, name: "Frank", bday: "1991-02-18" },
  { id: 7, name: "Grace", bday: "1989-09-27" },
  { id: 8, name: "Hannah", bday: "1993-12-05" },
  { id: 9, name: "Ian", bday: "1987-06-16" },
  { id: 10, name: "Judy", bday: "1994-08-21" },
]);

app.get('/', (req, res) => {
    statistics.requestCount = 0;
    res.sendFile('E:/Универ/3 курс/ПСКП/lab4/index.html');
})

app.get('/ss', (req, res) => {
    res.json(statistics.getStatistics());
})

app.get("/get", (req, res) => {
    statistics.requestCount = 0;
    res.json(DB.select()); 
});

app.post("/post", (req, res) => {
    statistics.requestCount = 0;
    res.json(DB.insert(req.body.obj));
});

app.put("/put", (req, res) => {
    statistics.requestCount = 0;
    res.json(DB.update(req.body.obj)); 
});

app.delete("/delete", (req, res) => {
  const id = req.query.id;
  statistics.requestCount = 0;
  res.json(DB.delete(id)); 
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
