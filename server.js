const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const LOG_FILE = path.join(__dirname, 'logs.txt');

// POST /log — receive and store logs
app.post('/log', (req, res) => {
  const logLine = req.body.log;
  if (logLine) {
    console.log(`[LOG] ${logLine}`);
    fs.appendFileSync(LOG_FILE, logLine + '\n');
    res.status(200).send('Received');
  } else {
    res.status(400).send('Missing "log" in body');
  }
});

// GET /logs — return all logs as text
app.get('/logs', (req, res) => {
  if (fs.existsSync(LOG_FILE)) {
    const logs = fs.readFileSync(LOG_FILE, 'utf8');
    res.type('text/plain').send(logs);
  } else {
    res.status(404).send('No logs found');
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Log Server is Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
