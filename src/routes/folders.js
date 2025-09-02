const express = require('express');
const router = express.Router();
const controller = require("../controllers/folders");
const authenticateToken = require("../middleware/middleware");

router.put("/create", authenticateToken, controller.createFolder);
router.post("/view_folder", authenticateToken, controller.viewFolder);
router.get("/view_all", authenticateToken, controller.viewAll);
router.delete("/delete", authenticateToken, controller.deleteFolder);
router.patch("/update", authenticateToken, controller.updateFolder);

module.exports = router;