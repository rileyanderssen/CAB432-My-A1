const express = require('express');
const router = express.Router();
const controller = require("../controllers/transcodes");
const authenticateToken = require("../middleware/middleware");

router.post("/transcode_file_id", authenticateToken, controller.transcodeFile);
router.post("/transcode_load_test", controller.transcodeFile);
router.get("/videos/:fileName", authenticateToken, controller.downloadTranscode);
router.post("/all", authenticateToken, controller.getAllTranscodes);
router.post("/single", authenticateToken, controller.getTranscodeById);
router.delete("/delete", authenticateToken, controller.deleteTranscodeById);

module.exports = router;