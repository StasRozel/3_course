const express = require('express');
const router = express.Router();
const pool = require('../db/database'); // Подключение к базе данных

// GET: Получить список всех аудиторий
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request().query('SELECT * FROM auditorium');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Добавить новую аудиторию
router.post('/', async (req, res) => {
    const { auditorium_name, auditorium_type, auditorium_capacity } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('auditorium_name', auditorium_name)
            .input('auditorium_type', auditorium_type)
            .input('auditorium_capacity', auditorium_capacity)
            .query('INSERT INTO auditorium (auditorium_name, auditorium_type, auditorium_capacity) OUTPUT INSERTED.* VALUES (@auditorium_name, @auditorium_type, @auditorium_capacity)');
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Обновить информацию об аудитории
router.put('/', async (req, res) => {
    const { auditorium_name, auditorium_type, auditorium_capacity } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('auditorium_name', auditorium_name)
            .input('auditorium_type', auditorium_type)
            .input('auditorium_capacity', auditorium_capacity)
            .query('UPDATE auditorium SET auditorium_type = @auditorium_type, auditorium_capacity = @auditorium_capacity OUTPUT INSERTED.* WHERE auditorium_name = @auditorium_name');
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Удалить аудиторию
router.delete('/:auditorium', async (req, res) => {
    const { auditorium } = req.params;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('auditorium', auditorium)
            .query('DELETE FROM auditorium OUTPUT DELETED.* WHERE auditorium_name = @auditorium');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json({ message: 'Auditorium not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
