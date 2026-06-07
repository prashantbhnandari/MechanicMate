const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/db.sqlite", (err) => {
    if (err) {
        console.error("❌ DB Error:", err);
    } else {
        console.log("✅ SQLite Connected");
    }
});

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
)
`);

module.exports = db;