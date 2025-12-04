require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }));

app.get('/', (req, res) => res.send('OK'));

bot.start(async (ctx) => {
  await ctx.reply('Bienvenue sur M4R-bot!');
});

bot.launch().then(() => console.log('Bot lancé en polling'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
