const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/log', (req, res) => {
  const logLine = req.body.log;
  console.log(`[LOG] ${logLine}`);
  fs.appendFileSync('logs.txt', logLine + '\n');
  res.send('Received');
});

app.get('/', (req, res) => res.send('Log Server is Running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
