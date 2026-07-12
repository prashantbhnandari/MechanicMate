let isOnline = false;
document.addEventListener("DOMContentLoaded", () => {

    console.log("🔥 Mechanic Dashboard Loaded");

    initMap();
    loadRequests();
    setInterval(loadRequests, 3000);

    setupOnlineSystem();   // 🔥 NEW
});


// =======================
// 🔥 SOCKET + ONLINE SYSTEM
// =======================
function setupOnlineSystem() {

    const socket = io("http://127.0.0.1:5000");

    const onlineBtn = document.getElementById("onlineBtn");
    const offlineBtn = document.getElementById("offlineBtn");

    // 🟢 ONLINE
    onlineBtn.addEventListener("click", () => {

        isOnline = true;

        onlineBtn.classList.add("active");
        offlineBtn.classList.remove("active");

        console.log("🟢 ONLINE");

        socket.emit("mechanicOnline", {
            id: "mech1",
            name: "Ramesh 🔧"
        });
    });

    // 🔴 OFFLINE
    offlineBtn.addEventListener("click", () => {

        isOnline = false;

        offlineBtn.classList.add("active");
        onlineBtn.classList.remove("active");

        console.log("🔴 OFFLINE");

        socket.emit("mechanicOffline", {
            id: "mech1"
        });
    });
}

// 📍 LOCATION SEND (ADD THIS)
navigator.geolocation.watchPosition(pos => {

    if (!isOnline) return; // ❌ offline → kuch nahi bhejna

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    socket.emit("mechanicLocation", {
        id: "mech1",
        lat,
        lng,
        name: "Ramesh 🔧"
    });

    console.log("📍 Sending location:", lat, lng);

});


// =======================
// MAP
// =======================
function initMap() {

    const mapDiv = document.getElementById("mechanicMap");

    if (!mapDiv) return;

    navigator.geolocation.getCurrentPosition(pos => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const map = L.map("mechanicMap").setView([lat, lng], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap"
        }).addTo(map);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup("You (Mechanic) 🔧")
            .openPopup();

    });
}


// =======================
// LOAD REQUESTS
// =======================
async function loadRequests() {

    const box = document.getElementById("requests");
    if (!box) return;

    // ❌ OFFLINE → kuch mat dikha
    if (!isOnline) {
        box.innerHTML = "<p>🔴 You are offline</p>";
        return;
    }

    try {

        const res = await fetch("http://127.0.0.1:5000/api/user/requests");
        const data = await res.json();

        box.innerHTML = "";

        data.forEach(r => {

            box.innerHTML += `
<div class="request-card" id="req-${r.id}">
    <p><b>Service:</b> ${r.service}</p>
    <p><b>Location:</b> ${r.location}</p>

    <div class="btn-group">
        <button class="accept-btn" onclick="acceptRequest(${r.id})">
            Accept
        </button>

        <button class="reject-btn" onclick="rejectRequest(${r.id})">
            Reject
        </button>
    </div>
</div>
`;
        });

    } catch (err) {
        console.log("❌ Fetch error:", err);
    }
}


// =======================
// ACCEPT REQUEST
// =======================
async function acceptRequest(id) {

    try {

        await fetch("http://127.0.0.1:5000/api/user/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                mechanicName: "Devendar 🔧",
                phone: "9876543210",
                lat: 30.31,
                lng: 78.03
            })
        });

        alert("Accepted ✅");

    } catch (err) {
        console.log("❌ Accept error:", err);
    }
}
function rejectRequest(id) {

    console.log("❌ Rejected:", id);

    // 🔥 CARD REMOVE
    const card = document.getElementById(`req-${id}`);

    if (card) {
        card.remove();
    }

}