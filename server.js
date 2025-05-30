const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Increase body size limit to handle large CS2 logs
app.use(express.text({ type: '*/*', limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

const LOG_FILE = path.join('/tmp', 'logs.txt'); // Railway-compatible path

// POST /log — receive and store logs
app.post('/log', (req, res) => {
  let logLine = req.body?.log;

  // Fallback: raw text body
  if (!logLine && typeof req.body === 'string') {
    logLine = req.body;
  }

  if (logLine) {
    try {
      console.log(`[LOG] ${logLine}`);
      fs.appendFileSync(LOG_FILE, logLine + '\n');
      res.status(200).send('Received');
    } catch (err) {
      console.error(' Error writing to log file:', err);
      res.status(500).send('Failed to write log');
    }
  } else {
    console.error(' Invalid log format:', req.body);
    res.status(400).send('Missing "log" in body');
  }
});

// GET /logs — return all logs as plain text
app.get('/logs', (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, '');
    }
    const logs = fs.readFileSync(LOG_FILE, 'utf8');
    res.type('text/plain').send(logs);
  } catch (err) {
    console.error(' Failed to read logs:', err);
    res.status(500).send('Error reading logs');
  }
});

// GET / — test route
app.get('/', (req, res) => {
  res.send('Log Server is Running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server listening on port ${PORT}`));
