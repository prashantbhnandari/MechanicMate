router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password required"
        });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.get(query, [email], (err, user) => {

        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Database error"
            });
        }

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                status: "error",
                message: "Invalid password"
            });
        }

        res.json({
            status: "success",
            message: "Login successful",
            role: user.role
        });

    });

});