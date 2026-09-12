const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/user", (req, res) => {
    res.json({
        id: req.query.id || null,
        balance: 0,
        friends: 0,
        level: 1,
        energy: 1000
    });
});

app.listen(PORT, () => {
    console.log(`🌐 NTF Web يعمل على المنفذ ${PORT}`);
});
