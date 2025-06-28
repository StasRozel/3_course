const express = require('express');
const router = express.Router();
const pool = require('../db/database'); // Подключение к базе данных

// GET: Получить список всех типов аудиторий
router.get('/', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request().query('SELECT * FROM auditorium_type');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Добавить новый тип аудитории
router.post('/', async (req, res) => {
    const { auditorium_type, type_name } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('auditorium_type', auditorium_type)
            .input('type_name', type_name)
            .query('INSERT INTO auditorium_type (auditorium_type, auditorium_typename) OUTPUT INSERTED.* VALUES (@auditorium_type, @type_name)');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Обновить информацию о типе аудитории
router.put('/', async (req, res) => {
    const { auditorium_type, type_name } = req.body;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('auditorium_type', auditorium_type)
            .input('type_name', type_name)
            .query('UPDATE auditorium_type SET auditorium_typename = @type_name OUTPUT INSERTED.* WHERE auditorium_type = @auditorium_type');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Удалить тип аудитории
router.delete('/:type', async (req, res) => {
    const { type } = req.params;
    try {
        await pool.connect();
        const result = await pool.request()
            .input('type', type)
            .query('DELETE FROM auditorium_type OUTPUT DELETED.* WHERE auditorium_type = @type');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json({ message: 'Auditorium type not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
