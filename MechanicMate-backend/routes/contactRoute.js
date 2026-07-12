const express = require("express");
const router = express.Router();
const transporter = require("../mail"); // mail.js wala file

router.post("/", async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Incoming contact:", name, email, message);

    try {
        await transporter.sendMail({
            from: email,
            to: "Mechanicmate185@gmail.com",
            subject: "New Contact Message",
            text: `Name: ${name}
Email: ${email}
Message: ${message}`
        });

        res.json({ message: "Email sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Email failed" });
    }
});

module.exports = router;