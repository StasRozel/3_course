const express = require('express');
const router = express.Router();
const pool = require('../db/database'); // Подключение к базе данных

// GET: Получить список всех аудиторий
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM auditorium');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Добавить новую аудиторию
router.post('/', async (req, res) => {
    const { auditorium, auditorium_name, auditorium_type, auditorium_capacity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO auditorium (auditorium, auditorium_name, auditorium_type, auditorium_capacity) VALUES ($1, $2, $3) RETURNING *',
            [auditorium, auditorium_name, auditorium_type, auditorium_capacity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Обновить информацию об аудитории
router.put('/', async (req, res) => {
    const { auditorium, auditorium_name, auditorium_type, auditorium_capacity } = req.body;
    try {
        const result = await pool.query(
            'UPDATE auditorium SET auditorium_name = $2, auditorium_type = $3, auditorium_capacity = $4 WHERE auditorium = $1 RETURNING *',
            [auditorium, auditorium_name, auditorium_type, auditorium_capacity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Удалить аудиторию
router.delete('/:auditorium', async (req, res) => {
    const { auditorium } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM auditorium WHERE auditorium = $1 RETURNING *',
            [auditorium]
        );
        res.json(result.rows[0] || { message: 'Auditorium not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
