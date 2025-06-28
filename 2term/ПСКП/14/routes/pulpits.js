const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Получить список всех кафедр
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request().query('SELECT * FROM pulpit');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавить новую кафедру
router.post('/', async (req, res) => {
    const { pulpit_code, pulpit_name, faculty_code } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('pulpit_code', pulpit_code)
            .input('pulpit_name', pulpit_name)
            .input('faculty_code', faculty_code)
            .query('INSERT INTO pulpit (pulpit, pulpit_name, faculty) OUTPUT INSERTED.* VALUES (@pulpit_code, @pulpit_name, @faculty_code)');
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Корректировать информацию о кафедре
router.put('/', async (req, res) => {
    const { pulpit_code, pulpit_name, faculty_code } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('pulpit_code', pulpit_code)
            .input('pulpit_name', pulpit_name)
            .input('faculty_code', faculty_code)
            .query('UPDATE pulpit SET pulpit_name = @pulpit_name, faculty = @faculty_code OUTPUT INSERTED.* WHERE pulpit = @pulpit_code');
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить кафедру
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('code', code)
            .query('DELETE FROM pulpit OUTPUT DELETED.* WHERE pulpit = @code');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json({ message: 'Pulpit not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
