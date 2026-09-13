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


// ================= MINING =================

app.post("/api/mining/start", async (req, res) => {
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
            energy: 1000,
            miningStart: null
        };
    }

    const user = db.data.users[id];

    if (!user.miningStart) {
        user.miningStart = Date.now();
        await db.write();
    }

    res.json(user);
});

app.get("/api/mining/status", async (req, res) => {
    await db.read();

    const id = req.query.id;

    if (!id || !db.data.users[id]) {
        return res.status(400).json({
            error: "User not found"
        });
    }

    const user = db.data.users[id];

    if (!user.miningStart) {
        return res.json(user);
    }

    const now = Date.now();
    const sixHours = 6 * 60 * 60 * 1000;

    const elapsed = Math.min(
        now - user.miningStart,
        sixHours
    );

    const rate = 0.0000012;
    const earned = (elapsed / 1000) * rate;

    user.balance += earned;

    if (elapsed >= sixHours) {
        user.miningStart = null;
    } else {
    }

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
