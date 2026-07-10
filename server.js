const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// GET progress
app.get('/api/progress', (req, res) => {
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // DB file doesn't exist yet, return empty object
                return res.json({});
            }
            console.error('Error reading db.json:', err);
            return res.status(500).json({ error: 'Failed to read database state' });
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            console.error('JSON parse error on db.json:', parseErr);
            res.status(500).json({ error: 'Database format corrupted' });
        }
    });
});

// POST progress
app.post('/api/progress', (req, res) => {
    const data = JSON.stringify(req.body, null, 2);
    fs.writeFile(DB_FILE, data, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to db.json:', err);
            return res.status(500).json({ error: 'Failed to write progress to database' });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`=== AIM Gamedev Database Running ===`);
    console.log(`API URL: http://localhost:${PORT}/api/progress`);
    console.log(`Database File: ${DB_FILE}`);
    console.log(`====================================`);
});
