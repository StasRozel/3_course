const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Получить список всех факультетов
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request().query('SELECT * FROM faculty');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавить новый факультет
router.post('/', async (req, res) => {
    const { faculty_code, faculty_name } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('faculty_code', faculty_code)
            .input('faculty_name', faculty_name)
            .query('INSERT INTO faculty (FACULTY, FACULTY_NAME) OUTPUT INSERTED.* VALUES (@faculty_code, @faculty_name)');
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Корректировать информацию о факультете
router.put('/', async (req, res) => {
    const { faculty_code, faculty_name } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('faculty_code', faculty_code)
            .input('faculty_name', faculty_name)
            .query('UPDATE faculty SET faculty_name = @faculty_name OUTPUT INSERTED.* WHERE faculty = @faculty_code');
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить факультет
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('code', code)
            .query('DELETE FROM faculty OUTPUT DELETED.* WHERE faculty = @code');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
