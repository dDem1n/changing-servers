const express = require('express');
const cors = require('cors');
const fs = require('fs'); // ← ДЛЯ РАБОТЫ С ФАЙЛАМИ
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ============================================================
//  📦 СОХРАНЕНИЕ ДАННЫХ В ФАЙЛ
// ============================================================

const DATA_FILE = 'data.json';

// Загружаем данные из файла при запуске
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      players = JSON.parse(data);
      console.log(`✅ Загружено ${Object.keys(players).length} игроков`);
    } else {
      players = {};
      console.log('📝 Создан новый файл данных');
    }
  } catch (e) {
    console.error('❌ Ошибка загрузки:', e);
    players = {};
  }
}

// Сохраняем данные в файл
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2), 'utf8');
    console.log('💾 Данные сохранены');
  } catch (e) {
    console.error('❌ Ошибка сохранения:', e);
  }
}

// Загружаем при старте
loadData();

// Сохраняем каждые 10 секунд (на всякий случай)
setInterval(saveData, 10000);

// Сохраняем при завершении сервера
process.on('SIGTERM', () => {
  saveData();
  process.exit(0);
});

process.on('SIGINT', () => {
  saveData();
  process.exit(0);
});

// ============================================================
//  🌐 ОСНОВНЫЕ РОУТЫ
// ============================================================

// Проверка сервера
app.get('/', (req, res) => {
  res.json({ status: 'Сервер работает!' });
});

// Вход
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (players[username] && players[username].password === password) {
    res.json({ ok: true, data: players[username] });
  } else {
    res.json({ ok: false, error: 'Неверный логин или пароль' });
  }
});

// Регистрация
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
      quests: {},
      lastQuestReset: null,
      allQuestsClaimed: false,
      battleDamage: 0,
      battleBlocks: 0,
      bossKills: 0
    };
    saveData(); // ← СОХРАНЯЕМ СРАЗУ!
    res.json({ ok: true });
  }
});

// Получить данные игрока
app.get('/player/:username', (req, res) => {
  const username = req.params.username;
  
  if (players[username]) {
    res.json({ ok: true, data: players[username] });
  } else {
    res.json({ ok: false, error: 'Игрок не найден' });
  }
});

// Обновить данные игрока
app.post('/update', (req, res) => {
  const { username, data } = req.body;
  
  if (players[username]) {
    players[username] = { ...players[username], ...data };
    saveData(); // ← СОХРАНЯЕМ ПОСЛЕ КАЖДОГО ОБНОВЛЕНИЯ!
    res.json({ ok: true });
  } else {
    res.json({ ok: false, error: 'Игрок не найден' });
  }
});

// Список всех игроков
app.get('/players', (req, res) => {
  const list = Object.keys(players).map(name => ({
    name: name,
    mmr: players[name].mmr,
    wins: players[name].wins,
    coins: players[name].coins
  }));
  res.json(list);
});

// ============================================================
//  🚀 ЗАПУСК
// ============================================================

app.listen(port, () => {
  console.log(`✅ Сервер работает на порту ${port}`);
  console.log(`📊 Игроков в базе: ${Object.keys(players).length}`);
});
