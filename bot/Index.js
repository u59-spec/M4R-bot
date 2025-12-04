require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// rate limiting pour l'API (sécurité)
const limiter = rateLimit({ windowMs: 15*60*1000, max: 200 });
app.use(limiter);

// simple health check
app.get('/', (req, res) => res.send('OK'));

// Bot commands
bot.start(async (ctx) => {
  const imageUrl = 'https://ton-site.vercel.app/assets/cover.jpg'; // héberge ton image
  await ctx.replyWithPhoto({ url: imageUrl }, {
    caption: `MENU M4R 🇫🇷\nLa meilleure qualité au meilleur prix.\n\nChoisis une option ci-dessous.`,
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Informations ℹ️', callback_data: 'infos' }, { text: 'Contact 📲', callback_data: 'contact' }],
        [{ text: 'M4R 75 Mini-App', web_app: { url: process.env.WEBAPP_URL } }],
        [{ text: 'Instagram', url: 'https://instagram.com/toncompte' }, { text: 'Telegram', url: 'https://t.me/tonpseudo' }]
      ]
    }
  });
});

// callback handling
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  if (data === 'infos') {
    await ctx.answerCbQuery();
    await ctx.reply('Infos produit :  taux de THC elevé ( Age requis : 18+.');
  } else if (data === 'contact') {
    await ctx.answerCbQuery();
    await ctx.reply('Contactez-nous : https://t.me/tonpseudo');
  } else {
    await ctx.answerCbQuery('Action non reconnue');
  }
});

// optional: catching web_app data (si la webapp poste un message)
bot.on('message', async (ctx) => {
  // si la webapp poste via Telegram.WebApp.sendData, ça arrive comme message texte
  if (ctx.message && ctx.message.text && ctx.message.text.startsWith('WEBAPP:')) {
    const payload = ctx.message.text.replace('WEBAPP:', '');
    // traite la commande / enregistre la commande
    await ctx.reply('Commande reçue ✅\nDétails : ' + payload);
  }
});

// Start bot with polling for dev
if (process.env.NODE_ENV !== 'production') {
  bot.launch().then(() => console.log('Bot lancé en polling'));
}

// For production you should configure webhook (Railway/Render ou un reverse proxy)
// Expose express for health checks or webhooks
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
