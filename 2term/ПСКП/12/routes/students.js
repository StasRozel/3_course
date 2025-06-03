const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, '../data/StudentList.json');

function readStudents() {
  if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, '[]');
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
}

function writeStudents(students) {
  fs.writeFileSync(dataFilePath, JSON.stringify(students, null, 2));
}

router.get('/', (req, res) => {
  const students = readStudents();
  res.json(students);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const students = readStudents();
  const student = students.find(s => s.id === id);

  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: `Student with id ${id} not found` });
  }
});

router.post('/', (req, res) => {
  const newStudent = req.body;
  const students = readStudents();

  if (students.some(s => s.id === newStudent.id)) {
    res.status(400).json({ error: 'Student with this ID already exists' });
  } else {
    students.push(newStudent);
    writeStudents(students);
    res.status(201).json(newStudent);
  }
});

router.put('/', (req, res) => {
  const updatedStudent = req.body;
  const students = readStudents();
  const index = students.findIndex(s => s.id === updatedStudent.id);

  if (index === -1) {
    res.status(404).json({ error: 'Student not found' });
  } else {
    students[index] = updatedStudent;
    writeStudents(students);
    res.json(updatedStudent);
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const students = readStudents();
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Student not found' });
  } else {
    const [removedStudent] = students.splice(index, 1);
    writeStudents(students);
    res.json(removedStudent);
  }
});

module.exports = router;
