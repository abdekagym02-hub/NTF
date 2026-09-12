require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const BotClass = TelegramBot.TelegramBot || TelegramBot.default || TelegramBot;

const token = process.env.BOT_TOKEN;

if (!token) {
    console.log("❌ BOT_TOKEN غير موجود");
    process.exit(1);
}

const bot = new BotClass(token, {
    polling: true
});

console.log("🤖 NTF Bot يعمل بنجاح");

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(
        msg.chat.id,
        `🤖 مرحبًا بك في NTF!

🚀 البوت يعمل بنجاح.
🎁 قريبًا ستتوفر المهام والمكافآت.`
    );
});
