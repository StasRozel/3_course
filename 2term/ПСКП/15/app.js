const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const uri = "your mongodb app url";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
app.use(bodyParser.json());

let db;
async function connectToDB() {
  await client.connect();
  db = client.db('BSTU');
  console.log('Connected to MongoDB');
}

// GET: получить список факультетов
app.get('/api/faculties', async (req, res) => {
  try {
    const faculties = await db.collection('faculty').find().toArray();
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: получить список кафедр
app.get('/api/pulpits', async (req, res) => {
  try {
    const pulpits = await db.collection('pulpit').find().toArray();
    res.json(pulpits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: добавить факультет
app.post('/api/faculties', async (req, res) => {
  try {
    const result = await db.collection('faculty').insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: добавить кафедру
app.post('/api/pulpits', async (req, res) => {
  try {
    const result = await db.collection('pulpit').insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: обновить информацию о факультете
app.put('/api/faculties', async (req, res) => {
  try {
    const { code, ...updateData } = req.body;
    const result = await db.collection('faculty').findOneAndUpdate(
      { _id: new ObjectId(code) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Faculty not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: обновить информацию о кафедре
app.put('/api/pulpits', async (req, res) => {
  try {
    const { code, ...updateData } = req.body;
    const result = await db.collection('pulpit').findOneAndUpdate(
      { _id: new ObjectId(code)},
      { $set: updateData },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Pulpit not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: удалить факультет
app.delete('/api/faculties/:code', async (req, res) => {
  try {
    const result = await db.collection('faculty').findOneAndDelete({ _id: new ObjectId(req.params.code) });
    if (!result) return res.status(404).json({ error: 'Faculty not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: удалить кафедру
app.delete('/api/pulpits/:code', async (req, res) => {
  try {
    const result = await db.collection('pulpit').findOneAndDelete({ _id: new ObjectId(req.params.code) });
    if (!result) return res.status(404).json({ error: 'Pulpit not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
});
