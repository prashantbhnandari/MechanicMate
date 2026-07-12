const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// =======================
// SOCKET SETUP
// =======================
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ROUTES
// =======================
const userRoutes = require("./routes/user");
const contactRoute = require("./routes/contactRoute");
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoute);

// 🔥 IMPORTANT (routes me use hoga)
app.set("io", io);


// =======================
// SOCKET LOGIC
// =======================
io.on("connection", (socket) => {

    console.log("⚡ New client connected:", socket.id);

    // =======================
    // LIVE LOCATION
    // =======================
    socket.on("mechanicLocation", (data) => {

        console.log("📍 Mechanic location:", data);

        // sab users ko bhej
        io.emit("liveLocation", data);
    });

    // =======================
    // MECHANIC OFFLINE
    // =======================
    socket.on("mechanicOffline", (data) => {

        console.log("🔴 Mechanic offline:", data.id);

        io.emit("removeMechanic", data.id);
    });

    socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
    });

});


// =======================
// START SERVER
// =======================
const PORT = 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});