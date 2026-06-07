document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("🔥 SUBMIT CLICKED");

        const email = form.email.value;
        const password = form.password.value;
        const role = form.role.value;

        try {
            const res = await fetch("http://localhost:5000/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, role })
            });

            const data = await res.json();

            console.log("RESPONSE:", data);

            alert(data.message);

        } catch (err) {
            console.log("ERROR:", err);
            alert("Error");
        }

    });

});