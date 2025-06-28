const express = require('express');
const { sequelize, Faculty, Pulpit, Teacher, Subject, AuditoriumType, Auditorium } = require('./models');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});


app.get('/api/faculties', async (req, res) => {
    try {
        const faculties = await Faculty.findAll();
        res.json(faculties);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch faculties' });
    }
});

app.get('/api/pulpits', async (req, res) => {
    try {
        const pulpits = await Pulpit.findAll();
        res.json(pulpits);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pulpits' });
    }
});

app.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
});

app.get('/api/subjects', async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

app.get('/api/auditoriumtypes', async (req, res) => {
    try {
        const auditoriumTypes = await AuditoriumType.findAll();
        res.json(auditoriumTypes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch auditorium types' });
    }
});

app.get('/api/auditoriums', async (req, res) => {
    try {
        const auditoriums = await Auditorium.findAll();
        res.json(auditoriums);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch auditoriums' });
    }
});

////////////////////////
app.post('/api/faculties', async (req, res) => {
    try {
        const { faculty, faculty_name } = req.body;

        const newFaculty = await Faculty.create({ faculty, faculty_name });
        res.status(201).json(newFaculty);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add faculty' });
    }
});

app.post('/api/pulpits', async (req, res) => {
    try {
        const { pulpit, pulpit_name, faculty } = req.body;
        const newPulpit = await Pulpit.create({ pulpit, pulpit_name, faculty });
        res.status(201).json(newPulpit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add pulpit' });
    }
});

app.post('/api/subjects', async (req, res) => {
    try {
        const { subject, subject_name, pulpit } = req.body;
        const newSubject = await Subject.create({ subject, subject_name, pulpit });
        res.status(201).json(newSubject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add subject' });
    }
});

app.post('/api/auditoriumstypes', async (req, res) => {
    try {
        const { auditorium_type, auditorium_typename } = req.body;
        const newAuditoriumType = await AuditoriumType.create({ auditorium_type, auditorium_typename });
        res.status(201).json(newAuditoriumType);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add auditorium type' });
    }
});

app.post('/api/auditoriums', async (req, res) => {
    try {
        const { auditorium, auditorium_name, auditorium_capacity, auditorium_type } = req.body;
        const newAuditorium = await Auditorium.create({ auditorium, auditorium_name, auditorium_capacity, auditorium_type });
        res.status(201).json(newAuditorium);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add auditorium' });
    }
});


app.put('/api/faculties', async (req, res) => {
    try {
        const { faculty, faculty_name } = req.body;
        const findFaculty = await Faculty.findOne({ where: { faculty } });

        if (findFaculty) {
            findFaculty.faculty_name = faculty_name;
            await findFaculty.save();
            res.status(200).json(findFaculty);
        } else {
            res.status(404).json({ error: 'Faculty not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update faculty' });
    }
});



////////////////////
app.put('/api/pulpits', async (req, res) => {
    try {
        const { pulpit, pulpit_name, faculty } = req.body;
        const findPulpit = await Pulpit.findOne({ where: { pulpit } });

        if (findPulpit) {
            findPulpit.pulpit_name = pulpit_name;
            findPulpit.FACULTY = faculty;
            await findPulpit.save();
            res.status(200).json(findPulpit);
        } else {
            res.status(404).json({ error: 'Pulpit not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update pulpit' });
    }
});

app.put('/api/subjects', async (req, res) => {
    try {
        const { subject, subject_name, pulpit } = req.body;
        const findSubject = await Subject.findOne({ where: { subject } });

        if (findSubject) {
            findSubject.subject_name = subject_name;
            findSubject.pulpit = pulpit;
            await findSubject.save();
            res.status(200).json(findSubject);
        } else {
            res.status(404).json({ error: 'Subject not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update subject' });
    }
});

app.put('/api/auditoriumstypes', async (req, res) => {
    try {
        const { auditorium_type, auditorium_typename } = req.body;
        const auditoriumType = await AuditoriumType.findOne({ where: { auditorium_type } });

        if (auditoriumType) {
            auditoriumType.auditorium_typename = auditorium_typename;
            await auditoriumType.save();
            res.status(200).json(auditoriumType);
        } else {
            res.status(404).json({ error: 'Auditorium type not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update auditorium type' });
    }
});

app.put('/api/auditoriums', async (req, res) => {
    try {
        const { auditorium, auditorium_name, auditorium_capacity, auditorium_type } = req.body;
        const findAuditorium = await Auditorium.findOne({ where: { auditorium } });

        if (findAuditorium) {
            findAuditorium.auditorium_name = auditorium_name;
            findAuditorium.auditorium_capacity = auditorium_capacity;
            findAuditorium.auditorium_type = auditorium_type;
            await findAuditorium.save();
            res.status(200).json(findAuditorium);
        } else {
            res.status(404).json({ error: 'Auditorium not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update auditorium' });
    }
});

////////////////////////////////////////////////////////////////
app.delete('/api/faculties/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const findFaculty = await Faculty.findOne({ where: { faculty: code } });
        if (!findFaculty) return res.status(404).json({ error: 'Faculty not found' });
        await findFaculty.destroy();
        res.status(200).json({ message: 'Faculty deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete faculty' });
    }
});

app.delete('/api/pulpits/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const findPulpit = await Pulpit.findOne({ where: { pulpit: code } });

        if (!findPulpit) return res.status(404).json({ error: 'Pulpit not found' });

        await findPulpit.destroy();
        res.status(200).json({ message: 'Pulpit deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete pulpit' });
    }
});

app.delete('/api/subjects/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const findSubject = await Subject.findOne({ where: { subject: code } });

        if (!findSubject) return res.status(404).json({ error: 'Subject not found' });

        await findSubject.destroy();
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete subject' });
    }
});

app.delete('/api/auditoriumtypes/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const auditoriumType = await AuditoriumType.findOne({ where: { auditorium_type: code } });

        if (!auditoriumType) return res.status(404).json({ error: 'Auditorium type not found' });

        await auditoriumType.destroy();
        res.status(200).json({ message: 'Auditorium type deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete auditorium type' });
    }
});

app.delete('/api/auditoriums/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const findAuditorium = await Auditorium.findOne({ where: { auditorium: code } });

        if (!findAuditorium) return res.status(404).json({ error: 'Auditorium not found' });

        await findAuditorium.destroy();
        res.status(200).json({ message: 'Auditorium deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete auditorium' });
    }
});

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
