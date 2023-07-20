const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const Datastore = require('nedb');

dotenv.config();

const app = express();
const port = process.env.PORT;
const db = new Datastore({ filename: process.env.DB_PATH, autoload: true });

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set the root route to serve 'index.html'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());

app.post('/api/scores', (req, res) => {
  const { name, score } = req.body;

  if (!name || !score || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid data. Name and numeric score are required.' });
  }
  db.insert({ name, score }, (err) => {
    if (err) {
      console.error('Error adding score to leaderboard:', err.message);
      res.status(500).json({ error: 'Failed to add score to the leaderboard.' });
    } else {
      res.status(201).json({ message: 'Score added to the leaderboard successfully.' });
    }
  });
});

// Endpoint to get the top 100 players from the leaderboard
app.get('/api/leaderboard', (req, res) => {
  db.find({}).sort({ score: -1 }).limit(100).exec((err, top100) => {
    if (err) {
      console.error('Error retrieving leaderboard data:', err.message);
      res.status(500).json({ error: 'Failed to retrieve leaderboard data.' });
    } else {
      res.json(top100);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
