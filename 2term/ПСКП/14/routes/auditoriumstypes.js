const express = require('express');
const router = express.Router();
const pool = require('../db/database'); // Подключение к базе данных

// GET: Получить список всех типов аудиторий
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM auditorium_type');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Добавить новый тип аудитории
router.post('/', async (req, res) => {
    const { auditorium_type, type_name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO auditorium_type (auditorium_type, auditorium_typename) VALUES ($1, $2) RETURNING *',
            [auditorium_type, type_name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Обновить информацию о типе аудитории
router.put('/', async (req, res) => {
    const { auditorium_type, type_name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE auditorium_type SET auditorium_typename = $2 WHERE auditorium_type = $1 RETURNING *',
            [auditorium_type, type_name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Удалить тип аудитории
router.delete('/:type', async (req, res) => {
    const { type } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM auditorium_type WHERE auditorium_type = $1 RETURNING *',
            [type]
        );
        res.json(result.rows[0] || { message: 'Auditorium type not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
