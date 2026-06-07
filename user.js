const express = require("express");
const router = express.Router();
const db = require("../database/db");

// 🔥 TEMP STORAGE
let requests = [];

// =======================
// TEST
// =======================
router.get("/", (req, res) => {
    res.json({ status: "success", message: "User API working" });
});

// =======================
// SIGNUP
// =======================
router.post("/signup", (req, res) => {
    const { email, password, role } = req.body;

    db.run(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, password, role],
        (err) => {
            if (err) {
                return res.json({ status: "error", message: "User already exists" });
            }
            res.json({ status: "success", message: "Signup successful" });
        }
    );
});

// =======================
// LOGIN
// =======================
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (err, user) => {
            if (!user) {
                return res.json({ status: "error", message: "Invalid email or password" });
            }
            res.json({ status: "success", role: user.role });
        }
    );
});

// =======================
// SEND REQUEST
// =======================
router.post("/request", (req, res) => {
    const { service, location, lat, lng } = req.body;

    const newRequest = {
        id: Date.now(),
        service,
        location,
        lat,
        lng,
        status: "pending",
        mechanic: null
    };

    requests.push(newRequest);

    console.log("📦 NEW REQUEST:", newRequest);

    const io = req.app.get("io");
    io.emit("newRequest", newRequest);

    res.json({ status: "success", message: "Request sent" });
});

// =======================
// GET REQUESTS
// =======================
router.get("/requests", (req, res) => {
    res.json(requests);
});

// =======================
// ACCEPT REQUEST
// =======================
router.post("/accept", (req, res) => {
    const { id, mechanicName,phone } = req.body;

    const request = requests.find(r => r.id == id);
    if (!request) {
        return res.json({ status: "error", message: "Request not found" });
    }

    request.status = "accepted";
    request.mechanic = mechanicName;
    request.phone = phone;

    console.log("✅ ACCEPTED:", request);

    const io = req.app.get("io");
    io.emit("requestAccepted", request);

    res.json({ status: "success" });
});

// =======================
// ❌ REJECT REQUEST (IMPORTANT)
// =======================
router.post("/reject", (req, res) => {
    const { id } = req.body;

    requests = requests.filter(r => r.id != id);

    console.log("❌ REJECTED:", id);

    res.json({ status: "success" });
});

module.exports = router;