const express = require("express");
const router = express.Router();

// TEST ROUTE
router.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Mechanic API working ✅"
    });
});

// RECEIVE USER REQUEST
router.post("/request", (req, res) => {
    const { service, location, lat, lng } = req.body;

    if (!service || !location) {
        return res.status(400).json({
            status: "error",
            message: "Service and location required"
        });
    }

    res.json({
        status: "success",
        message: "Request received by mechanic",
        data: { service, location, lat, lng }
    });
});

module.exports = router;