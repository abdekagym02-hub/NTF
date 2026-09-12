const express = require("express");
const { db, initDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/user", async (req, res) => {
app.post("/api/mining/click", async (req, res) => {
    await db.read();

    const id = req.body.id;

    if (!id) {
        return res.status(400).json({ error: "User ID required" });
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
        return res.status(400).json({ error: "No energy" });
    }

    user.balance += 1;
    user.energy -= 1;

    await db.write();

    res.json(user);
});
    await db.read();

    const id = req.query.id || "test";

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

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🌐 NTF Web يعمل على المنفذ ${PORT}`);
    });
});
