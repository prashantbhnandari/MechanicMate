// HERO - Find Mechanic button action
// HERO BUTTON (landing page)
document.addEventListener("DOMContentLoaded", () => {
    const heroBtn = document.getElementById("findMechanicBtn");

    if (heroBtn) {
        heroBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});


// SERVICE CLICK FROM LANDING PAGE
document.querySelectorAll(".service-box").forEach(card => {
    card.addEventListener("click", () => {
        const service = card.getAttribute("data-service");

        // service save
        localStorage.setItem("selectedService", service);

        // login page
        window.location.href = "login.html";
    });
});

// SHOW SELECTED SERVICE ON USER DASHBOARD
const serviceText = document.getElementById("selectedServiceText");
const selectedService = localStorage.getItem("selectedService");

if (serviceText && selectedService) {
    serviceText.innerText = "Selected Service: " + selectedService;
}
document.getElementById("findMechanicBtn").addEventListener("click", () => {
    const location = document.querySelector(".card input").value;
    const service = localStorage.getItem("selectedService");

    if (!location) {
        alert("Please enter location");
        return;
    }

    // save request
    localStorage.setItem("userLocation", location);

    // redirect to mechanic dashboard
    window.location.href = "mechanic-dashboard.html";
});
