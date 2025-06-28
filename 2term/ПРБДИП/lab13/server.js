const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/lab13', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Схемы и модели
const clientSchema = new mongoose.Schema({
  clientId: Number,
  name: String,
  email: String,
  subscription: [String],
  joinDate: Date,
  balance: Number
});

const taskSchema = new mongoose.Schema({
  taskId: Number,
  clientId: Number,
  description: String,
  status: String,
  dueDate: Date,
  priority: String
});

const Client = mongoose.model('Client', clientSchema);
const Task = mongoose.model('Task', taskSchema);

// 2. Инициализация данных
app.post('/init-data', async (req, res) => {
  try {
    await Client.deleteMany({});
    await Task.deleteMany({});

    const clients = await Client.insertMany([
      { clientId: 1, name: "Alice Smith", email: "alice@example.com", subscription: ["premium", "ebook"], joinDate: new Date("2024-01-10"), balance: 50.00 },
      { clientId: 2, name: "Bob Johnson", email: "bob@example.com", subscription: ["basic"], joinDate: new Date("2024-06-15"), balance: 10.00 },
      { clientId: 3, name: "Charlie Brown", email: "charlie@example.com", subscription: ["premium"], joinDate: new Date("2023-11-20"), balance: 30.00 },
      { clientId: 4, name: "Diana Lee", email: "diana@example.com", subscription: ["ebook"], joinDate: new Date("2025-02-01"), balance: 0.00 }
    ]);

    const tasks = await Task.insertMany([
      { taskId: 1, clientId: 1, description: "Issue book: The Hobbit", status: "pending", dueDate: new Date("2025-06-01"), priority: "high" },
      { taskId: 2, clientId: 2, description: "Return reminder: 1984", status: "completed", dueDate: new Date("2025-05-15"), priority: "medium" },
      { taskId: 3, clientId: 1, description: "Issue book: Dune", status: "pending", dueDate: new Date("2025-06-10"), priority: "low" },
      { taskId: 4, clientId: 3, description: "Renew subscription", status: "pending", dueDate: new Date("2025-05-30"), priority: "high" }
    ]);

    res.json({ message: 'Data initialized', clients, tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Обновление элементов
app.post('/update-balances', async (req, res) => {
  try {
    const result = await Client.updateMany(
      { subscription: { $in: ["premium"] } },
      { $inc: { balance: 20 } }
    );
    await Task.updateOne(
      { taskId: 3 },
      { $set: { status: "completed" } }
    );
    res.json({ message: 'Balances and task updated', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Выборка элементов
app.get('/query-clients', async (req, res) => {
  try {
    const queries = [
      Client.find({ $and: [{ balance: { $gt: 20 } }, { subscription: { $in: ["premium"] } }] }),
      Client.find({ subscription: { $in: ["ebook"] } }),
      Task.find({ priority: { $exists: true } }),
      Client.find({ balance: { $type: 1 } }), // 1 - double
      Client.find({ email: { $regex: "example\\.com", $options: "i" } })
    ];
    const results = await Promise.all(queries);
    res.json({ 
      highBalancePremium: results[0],
      ebookClients: results[1],
      tasksWithPriority: results[2],
      doubleBalance: results[3],
      exampleEmail: results[4]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Выборка с проекциями
app.get('/project-clients-tasks', async (req, res) => {
  try {
    const clients = await Client.find({ balance: { $gt: 0 } }, { name: 1, balance: 1, _id: 0 });
    const tasks = await Task.find({ status: "pending" }, { description: 1, status: 1, _id: 0 });
    res.json({ clients, tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Подсчет элементов
app.get('/count-clients', async (req, res) => {
  try {
    const total = await Client.countDocuments();
    const premium = await Client.countDocuments({ subscription: { $in: ["premium"] } });
    res.json({ total, premium });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Limit и skip
app.get('/limit-skip', async (req, res) => {
  try {
    const limitedClients = await Client.find().limit(2);
    const skippedTasks = await Task.find().skip(2);
    res.json({ limitedClients, skippedTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Distinct
app.get('/distinct', async (req, res) => {
  try {
    const subscriptions = await Client.distinct("subscription");
    const priorities = await Task.distinct("priority");
    res.json({ subscriptions, priorities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Агрегатные операции
app.get('/aggregate', async (req, res) => {
  try {
    const result = await Client.aggregate([
      { $unwind: "$subscription" },
      { $group: { _id: "$subscription", averageBalance: { $avg: "$balance" } } },
      { $sort: { averageBalance: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. $match с группировкой
app.get('/aggregate-match', async (req, res) => {
  try {
    const emptyMatch = await Task.aggregate([
      { $match: {} },
      { $group: { _id: { status: "$status", priority: "$priority" }, totalTasks: { $sum: 1 } } }
    ]);
    const highPriority = await Task.aggregate([
      { $match: { priority: "high" } },
      { $group: { _id: { status: "$status", priority: "$priority" }, totalTasks: { $sum: 1 } } }
    ]);
    res.json({ emptyMatch, highPriority });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});