const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let players = {};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (players[username] && players[username].password === password) {
    res.json({ ok: true, data: players[username] });
  } else {
    res.json({ ok: false, error: 'Неверный логин или пароль' });
  }
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (players[username]) {
    res.json({ ok: false, error: 'Такой игрок уже есть' });
  } else {
    players[username] = { 
      password: password,
      coins: 1000,
      mmr: 0,
      wins: 0,
      losses: 0
    };
    res.json({ ok: true });
  }
});

app.get('/player/:username', (req, res) => {
  const username = req.params.username;
  if (players[username]) {
    res.json({ ok: true, data: players[username] });
  } else {
    res.json({ ok: false });
  }
});

app.post('/update', (req, res) => {
  const { username, data } = req.body;
  if (players[username]) {
    players[username] = { ...players[username], ...data };
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Сервер работает!' });
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
