const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Получить список всех кафедр
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pulpit');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавить новую кафедру
router.post('/', async (req, res) => {
    const { pulpit_code, pulpit_name, faculty_code } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO pulpit (pulpit, pulpit_name, faculty) VALUES ($1, $2, $3) RETURNING *',
            [pulpit_code, pulpit_name, faculty_code]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Корректировать информацию о кафедре
router.put('/', async (req, res) => {
    const { pulpit_code, pulpit_name, faculty_code } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pulpit SET pulpit_name = $2, faculty = $3 WHERE pulpit = $1 RETURNING *',
            [pulpit_code, pulpit_name, faculty_code]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить кафедру
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM pulpit WHERE pulpit = $1 RETURNING *',
            [code]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
