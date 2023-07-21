const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const http = require("http");
const Datastore = require("nedb");

dotenv.config();

const app = express();
const port = process.env.PORT;
const db = new Datastore({ filename: process.env.DB_PATH, autoload: true });

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(express.json());

app.post("/api/scores", (req, res) => {
  const { name, score } = req.body;

  if (!name || !score || typeof score !== "number") {
    return res
      .status(400)
      .json({ error: "Invalid data. Name and numeric score are required." });
  }
  db.insert({ name, score }, (err, document) => {
    if (err) {
      console.error("Error adding score to leaderboard:", err.message);
      res
        .status(500)
        .json({ error: "Failed to add score to the leaderboard." });
    } else {
      res
        .status(201)
        .json({ message: "Score added to the leaderboard successfully." });
      io.emit('score-added', document);
    }
  });
});

// Endpoint to get the top 100 players from the leaderboard
app.get("/api/leaderboard", (req, res) => {
  db.find({})
    .sort({ score: -1 })
    .limit(100)
    .exec((err, top100) => {
      if (err) {
        console.error("Error retrieving leaderboard data:", err.message);
        res.status(500).json({ error: "Failed to retrieve leaderboard data." });
      } else {
        res.json(top100);
      }
    });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
