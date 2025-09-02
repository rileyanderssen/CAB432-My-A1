const express = require('express');
const router = express.Router();
const controller = require("../controllers/files");
const authenticateToken = require("../middleware/middleware");
const multer = require("multer");

// idea for further user functionality -> file system (with folders)

// const upload = multer({ dest: "uploads/tmp/" });
const upload = multer({ 
    dest: "uploads/tmp/",
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB in bytes
        fieldSize: 50 * 1024 * 1024  // 50MB for field data
    }
});

// router.put("/upload", authenticateToken, upload.single("video"), controller.uploadFile);
router.put("/upload", authenticateToken, (req, res, next) => {
    req.setTimeout(300000); // 5 minutes
    next();
}, upload.single("video"), controller.uploadFile);
router.post("/all_files", authenticateToken, controller.getAllFiles);
router.get("/single_file_title", authenticateToken, controller.getFileByTitle);
router.get("/single_file_id", authenticateToken, controller.getFileById);
router.delete("/delete_file_title", authenticateToken, controller.deleteFileByTitle);
router.delete("/delete_file_id", authenticateToken, controller.deleteFileById);
router.patch("/update_file_title", authenticateToken, controller.updateFileByTitle);
router.patch("/update_file_id", authenticateToken, controller.updateFileById);

module.exports = router;