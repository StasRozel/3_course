const express = require('express');
const bodyParser = require('body-parser');
const facultiesRouter = require('./routes/faculties');
const pulpitsRouter = require('./routes/pulpits');
const subjectsRouter = require('./routes/subjects');
const auditoriumstypesRouter = require('./routes/auditoriumstypes');
const auditoriumsRouter = require('./routes/auditoriums');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Роуты
app.use('/api/faculties', facultiesRouter);
app.use('/api/pulpits', pulpitsRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/auditoriumstypes', auditoriumstypesRouter);
app.use('/api/auditoriums', auditoriumsRouter);

// Статический HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
