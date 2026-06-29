const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // Импортируем Supabase

const app = express();
app.use(cors());
app.use(express.json());

// --- Подключаемся к Supabase ---
const supabaseUrl = sb_secret_xNrEdVwFDVO361g9z0RzvQ_mwOBlrBD;
const supabaseKey = sb_publishable_FEtDvGdU6DxUIJM_Xnv6YA_OIPfna4-;
const supabase = createClient(supabaseUrl, supabaseKey); // [citation:10][citation:12]
// ------------------------------

// Функция для получения данных игрока из БД
async function getPlayer(username) {
    const { data, error } = await supabase
        .from('players') // Таблица в БД, создадим её чуть позже
        .select('*')
        .eq('username', username)
        .single();
    if (error) return null;
    return data;
}

// Функция для сохранения данных игрока в БД
async function savePlayer(username, data) {
    const { error } = await supabase
        .from('players')
        .upsert({ username, ...data }); // Обновить или создать запись
    if (error) console.error('Ошибка сохранения в Supabase:', error);
}

// --- Твой роут для входа ---
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const player = await getPlayer(username);
    
    if (player && player.password === password) {
        res.json({ ok: true, data: player });
    } else {
        res.json({ ok: false, error: 'Неверный логин или пароль' });
    }
});

// --- Роут для обновления данных ---
app.post('/update', async (req, res) => {
    const { username, data } = req.body;
    await savePlayer(username, data);
    res.json({ ok: true });
});

// --- Остальные твои роуты (регистрация, получение игрока) переписывай по такому же принципу ---

app.listen(process.env.PORT || 3000, () => {
    console.log('Сервер запущен!');
});
