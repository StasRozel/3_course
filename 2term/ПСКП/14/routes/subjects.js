const express = require('express');
const router = express.Router();
const pool = require('../db/database'); // Подключение к базе данных

// GET: Получить список всех дисциплин
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request().query('SELECT * FROM subject');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Добавить новую дисциплину
router.post('/', async (req, res) => {
    const { subject_code, subject_name, pulpit } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('subject_code', subject_code)
            .input('subject_name', subject_name)
            .input('pulpit', pulpit)
            .query('INSERT INTO subject (subject, subject_name, pulpit) OUTPUT INSERTED.* VALUES (@subject_code, @subject_name, @pulpit)');
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Обновить информацию о дисциплине
router.put('/', async (req, res) => {
    const { subject_code, subject_name, pulpit } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('subject_code', subject_code)
            .input('subject_name', subject_name)
            .input('pulpit', pulpit)
            .query('UPDATE subject SET subject_name = @subject_name, pulpit = @pulpit OUTPUT INSERTED.* WHERE subject = @subject_code');
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Удалить дисциплину
router.delete('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('code', code)
            .query('DELETE FROM subject OUTPUT DELETED.* WHERE subject = @code');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json({ message: 'Subject not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
