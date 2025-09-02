const express = require('express');
const router = express.Router();
const controller = require("../controllers/loadTests");
const authenticateToken = require("../middleware/middleware");

router.post("/run", authenticateToken, controller.loadTest);

module.exports = router;