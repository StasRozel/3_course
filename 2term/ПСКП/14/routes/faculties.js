const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Получить список всех факультетов
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculty');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавить новый факультет
router.post('/', async (req, res) => {
    const { faculty_code, faculty_name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO faculty (FACULTY, FACULTY_NAME) VALUES ($1, $2) RETURNING *',
            [faculty_code, faculty_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Корректировать информацию о факультете
router.put('/', async (req, res) => {
    const { faculty_code, faculty_name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE faculty SET faculty_name = $2 WHERE faculty = $1 RETURNING *',
            [faculty_code, faculty_name]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить факультет
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM faculy WHERE faculty = $1 RETURNING *',
            [code]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
