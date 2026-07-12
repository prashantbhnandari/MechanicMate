let selectedService = "";
let userLat = null;
let userLng = null;


// =======================
// SOCKET CONNECT
// =======================
const socket = io("http://127.0.0.1:5000");

socket.on("connect", () => {
    console.log("✅ Socket connected");
});


// =======================
// 🔥 MECHANIC LIVE LOCATION
// =======================
let mechanicMarker = null;

// 📍 SHOW MECHANIC
socket.on("liveLocation", (data) => {

    console.log("📍 Received:", data);

    // 🔥 FIRST TIME
    if (!mechanicMarker) {

        mechanicMarker = L.marker([data.lat, data.lng])
            .addTo(map)
            .bindPopup(data.name)
            .openPopup();

    } else {

        // 🔥 UPDATE LOCATION
        mechanicMarker.setLatLng([data.lat, data.lng]);

    }
});


// ❌ REMOVE MECHANIC
socket.on("removeMechanic", () => {

    if (mechanicMarker) {

        map.removeLayer(mechanicMarker);

        mechanicMarker = null;
    }

    console.log("❌ Mechanic removed");
});


// 🔥 ACCEPT LISTENER
socket.on("requestAccepted", (data) => {

    console.log("🔥 Accepted:", data);

    const box = document.getElementById("statusBox");

    box.innerHTML = `
        <h3>🚗 Mechanic Assigned</h3>

        <p><b>Name:</b> ${data.mechanic}</p>

        <p><b>Phone:</b> ${data.phone}</p>

        <a href="tel:${data.phone}" class="call-btn">
            📞 Call Now
        </a>
    `;
});


// =======================
// SERVICE SELECT
// =======================
const services = document.querySelectorAll(".service-card");

services.forEach(service => {

    service.addEventListener("click", () => {

        services.forEach(s => s.classList.remove("active"));

        service.classList.add("active");

        selectedService = service.dataset.service;

    });

});


// =======================
// MAP
// =======================
const map = L.map("userMap").setView([30.3165, 78.0322], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(map);


// =======================
// 🔥 CUSTOM ICON
// =======================
const mechanicIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3061/3061718.png",
    iconSize: [40, 40]
});


// =======================
// 🔥 DUMMY MECHANICS DATA
// =======================
const mechanicsData = [

    {
        name: "Devendar 🔧",
        rating: "4.5"
    },

    {
        name: "Ramesh 🔧",
        rating: "3.6"
    },

    {
        name: "Akash 🔧",
        rating: "3.8"
    },

    {
        name: "Mohit 🔧",
        rating: "4.5"
    }

];


// =======================
// 🔥 STORE DUMMY MARKERS
// =======================
let dummyMarkers = [];


// =======================
// 🔥 LIVE USER LOCATION
// =======================
let userMarker;

navigator.geolocation.watchPosition(

    (position) => {

        userLat = position.coords.latitude;
        userLng = position.coords.longitude;

        console.log("📍 Updated:", userLat, userLng);

        // 🔥 FIRST TIME
        if (!userMarker) {

            userMarker = L.marker([userLat, userLng])
                .addTo(map)
                .bindPopup("📍 Your Location")
                .openPopup();

            map.setView([userLat, userLng], 14);

        } else {

            // 🔥 UPDATE USER LOCATION
            userMarker.setLatLng([userLat, userLng]);

            map.panTo([userLat, userLng]);

        }


        // =======================
        // 🔥 REMOVE OLD DUMMY MARKERS
        // =======================
        dummyMarkers.forEach(marker => {
            map.removeLayer(marker);
        });

        dummyMarkers = [];


        // =======================
        // 🔥 CREATE NEW NEARBY MECHANICS
        // =======================
        mechanicsData.forEach(mech => {

            const randomLat =
                userLat + (Math.random() - 0.5) * 0.01;

            const randomLng =
                userLng + (Math.random() - 0.5) * 0.01;

            const marker = L.marker(
                [randomLat, randomLng],
                { icon: mechanicIcon }
            )
                .addTo(map)
                .bindPopup(`
                <b>${mech.name}</b><br>
                ⭐ ${mech.rating} Rating<br>
                🛠️ Nearby Mechanic
            `);

            dummyMarkers.push(marker);

        });

    },

    (error) => {

        console.log("❌ Location Error:", error);

    },

    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    }

);


// =======================
// FIND MECHANIC
// =======================
document.getElementById("findBtn").addEventListener("click", async () => {

    const location = document.getElementById("locationInput").value;

    if (!selectedService || !location) {

        alert("Fill all fields");

        return;
    }

    try {

        const res = await fetch("http://127.0.0.1:5000/api/user/request", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                service: selectedService,
                location,
                lat: userLat,
                lng: userLng

            })

        });

        const data = await res.json();

        alert("Request sent ✅");

    } catch (err) {

        alert("Server error ❌");

    }

});