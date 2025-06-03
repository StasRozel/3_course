const express = require('express');
const router = express.Router();
const pool = require('../db/database'); // Подключение к базе данных

// GET: Получить список всех дисциплин
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subject');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Добавить новую дисциплину
router.post('/', async (req, res) => {
    const { subject_code, subject_name, pulpit } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO subject (subject, subject_name, pulpit) VALUES ($1, $2) RETURNING *',
            [subject_code, subject_name, pulpit]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Обновить информацию о дисциплине
router.put('/', async (req, res) => {
    const { subject_code, subject_name, pulpit } = req.body;
    try {
        const result = await pool.query(
            'UPDATE subject SET subject_name = $2, pulpit = $3 WHERE subject = $1 RETURNING *',
            [subject_code, subject_name, pulpit]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Удалить дисциплину
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM subject WHERE subject = $1 RETURNING *',
            [code]
        );
        res.json(result.rows[0] || { message: 'Subject not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
