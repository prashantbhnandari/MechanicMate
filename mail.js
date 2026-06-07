const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mechanicmate185@gmail.com",
        pass: "itjyfhvylrdmypsv"
    }
});

module.exports = transporter;