document.addEventListener("DOMContentLoaded", () => {

    console.log("🔥 login.js loaded");

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("🔥 LOGIN CLICKED");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            console.log("LOGIN RESPONSE:", data);

            if (data.status === "success") {

                if (data.role === "user") {
                    window.location.href = "user-dashboard.html";
                } else {
                    window.location.href = "mechanic-dashboard.html";
                }

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Login failed ❌");
        }

    });

});