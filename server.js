const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let players = {};

// ===== ГЛАВНАЯ СТРАНИЦА (проверка что сервер работает) =====
app.get('/', (req, res) => {
  res.json({ status: 'Сервер работает!' });
});

// ===== ВХОД В ИГРУ =====
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (players[username] && players[username].password === password) {
    res.json({ ok: true, data: players[username] });
  } else {
    res.json({ ok: false, error: 'Неверный логин или пароль' });
  }
});

// ===== РЕГИСТРАЦИЯ =====
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
      losses: 0,
      calibrationGames: 0,
      ownedWeapons: [],
      activeWeaponId: -1,
      starterCaseUsed: false,
      nickColor: 'white',
      ownedNickColors: ['white'],
      bpXp: 0,
      bpLevel: 0,
      bpClaimed: [],
      bpFreeCase: 0,
      quests: null,
      lastQuestReset: null,
      allQuestsClaimed: false,
      battleDamage: 0,
      battleBlocks: 0,
      bossKills: 0
    };
    res.json({ ok: true });
  }
});

// ===== ПОЛУЧИТЬ ДАННЫЕ ИГРОКА =====
app.get('/player/:username', (req, res) => {
  const username = req.params.username;
  
  if (players[username]) {
    res.json({ ok: true, data: players[username] });
  } else {
    res.json({ ok: false, error: 'Игрок не найден' });
  }
});

// ===== ОБНОВИТЬ ДАННЫЕ ИГРОКА =====
app.post('/update', (req, res) => {
  const { username, data } = req.body;
  
  if (players[username]) {
    players[username] = { ...players[username], ...data };
    res.json({ ok: true });
  } else {
    res.json({ ok: false, error: 'Игрок не найден' });
  }
});

// ===== ПОЛУЧИТЬ СПИСОК ВСЕХ ИГРОКОВ =====
app.get('/players', (req, res) => {
  const list = Object.keys(players).map(name => ({
    name: name,
    mmr: players[name].mmr,
    wins: players[name].wins,
    coins: players[name].coins
  }));
  res.json(list);
});

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(port, () => {
  console.log(`✅ Сервер работает на порту ${port}`);
});
