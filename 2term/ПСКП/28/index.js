const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const app = express();
const port = 3000;
const PHONEBOOK_FILE = 'phonebook.json';

// Load OpenAPI specification
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Load phonebook from JSON file
function loadPhonebook() {
  try {
    if (fs.existsSync(PHONEBOOK_FILE)) {
      const data = fs.readFileSync(PHONEBOOK_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [
      { id: '1', name: 'John Doe', phone: '+1234567890', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', phone: '+0987654321', email: 'jane@example.com' }
    ];
  } catch (error) {
    console.error('Error loading phonebook:', error);
    return [];
  }
}

// Save phonebook to JSON file
function savePhonebook(phonebook) {
  try {
    fs.writeFileSync(PHONEBOOK_FILE, JSON.stringify(phonebook, null, 2));
  } catch (error) {
    console.error('Error saving phonebook:', error);
  }
}

// Initialize phonebook
let phonebook = loadPhonebook();

// GET /TS - Get all phonebook entries
app.get('/TS', (req, res) => {
  res.json(phonebook);
});

// POST /TS - Add new phone entry
app.post('/TS', (req, res) => {
  const newEntry = req.body;
  if (!newEntry.id || !newEntry.name || !newEntry.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  phonebook.push(newEntry);
  savePhonebook(phonebook);
  res.status(201).json(newEntry);
});

// PUT /TS - Update phone entry
app.put('/TS', (req, res) => {
  const updatedEntry = req.body;
  if (!updatedEntry.id) {
    return res.status(400).json({ error: 'Missing ID' });
  }
  const index = phonebook.findIndex(entry => entry.id === updatedEntry.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  phonebook[index] = updatedEntry;
  savePhonebook(phonebook);
  res.json(updatedEntry);
});

// DELETE /TS - Delete phone entry
app.delete('/TS', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing ID' });
  }
  const index = phonebook.findIndex(entry => entry.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  phonebook.splice(index, 1);
  savePhonebook(phonebook);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Phonebook API running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
  console.log(`Phonebook UI available at http://localhost:${port}`);
});