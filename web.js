require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { db, initDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const token = process.env.BOT_TOKEN;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// ================= USER =================

app.get("/api/user", async (req, res) => {
    await db.read();

    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            error: "User ID required"
        });
    }

    if (!db.data.users[id]) {
        db.data.users[id] = {
            balance: 0,
            friends: 0,
            level: 1,
            energy: 1000
        };

        await db.write();
    }

    res.json(db.data.users[id]);
});

// ================= MINING CLICK =================

app.post("/api/mining/click", async (req, res) => {
    await db.read();

    const id = req.body.id;

    if (!id) {
        return res.status(400).json({
            error: "User ID required"
        });
    }

    if (!db.data.users[id]) {
        db.data.users[id] = {
            balance: 0,
            friends: 0,
            level: 1,
            energy: 1000
        };
    }

    const user = db.data.users[id];

    if (user.energy <= 0) {
        return res.status(400).json({
            error: "No energy"
        });
    }

    user.balance += 0.0000001 ;
    user.energy -= 0.0000001;

    await db.write();

    res.json(user);
});

// ================= TELEGRAM BOT =================

if (token) {

    const bot = new TelegramBot(token, {
        polling: true
    });

    console.log("🤖 NTF Bot يعمل بنجاح");

    bot.onText(/\/start/, async (msg) => {

        await bot.sendMessage(
            msg.chat.id,
            `🤖 مرحبًا بك في NTF!

🚀 اضغط على الزر لفتح التطبيق.`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "🚀 فتح NTF",
                                web_app: {
                                    url: "https://ntf-ombh.onrender.com"
                                }
                            }
                        ]
                    ]
                }
            }
        );
    });

    bot.on("polling_error", (error) => {
        console.log("⚠️ Telegram polling:", error.message);
    });

} else {
    console.log("⚠️ BOT_TOKEN غير موجود");
}

// ================= START =================

initDB().then(() => {

    app.listen(PORT, () => {
        console.log(`🌐 NTF Web يعمل على المنفذ ${PORT}`);
    });

});
