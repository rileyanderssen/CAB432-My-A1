const express = require('express');
const router = express.Router();
const controller = require("../controllers/users");

router.post("/authenticate", controller.authenticateUser);

// for testing
router.delete("/clear_db", controller.clearDatabase);

module.exports = router;