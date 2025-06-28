const { Telegraf } = require('telegraf');
require('dotenv').config();

// Initialize the bot with your Telegram Bot Token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Handle all text messages
bot.on('text', (ctx) => {
    const userMessage = ctx.message.text;
    ctx.reply(`echo: ${userMessage}`);
});

// Error handling
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}`, err);
});

// Start the bot with long polling
bot.launch()
    .then(() => console.log('Bot started with long polling'))
    .catch((err) => console.error('Failed to start bot:', err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));