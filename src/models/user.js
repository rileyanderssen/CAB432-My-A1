const {
    MockUserDB,
    MockFileDB,
    MockTranscodeDB, 
    MockFolderDB
} = require("../../db");
const fs = require('fs');
const path = require('path');

exports.authenticate = (email, password) => {
    for (let i = 0; i < MockUserDB.length; i++) {
        if (MockUserDB[i].email === email && MockUserDB[i].password === password) {
            return { valid: true, id: MockUserDB[i].id };
        }
    }

    return { valid: false };
}

// for testing
exports.clearDb = () => {
    MockFolderDB.splice(0);
    MockFileDB.splice(0);
    MockTranscodeDB.splice(0);
    const uploadsPath = path.join(__dirname, '../../uploads');
    const tmpPath = path.join(__dirname, '../../uploads/tmp');

    // Empty uploads/tmp folder
    if (fs.existsSync(tmpPath)) {
        const tmpFiles = fs.readdirSync(tmpPath);
        tmpFiles.forEach(file => {
            const filePath = path.join(tmpPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                fs.unlinkSync(filePath);
            } else if (stat.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true });
            }
        });
    }

    // Empty uploads folder (but keep tmp subfolder)
    if (fs.existsSync(uploadsPath)) {
        const uploadFiles = fs.readdirSync(uploadsPath);
        uploadFiles.forEach(file => {
            if (file !== 'tmp') { // Don't remove the tmp folder itself
                const filePath = path.join(uploadsPath, file);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    fs.unlinkSync(filePath);
                } else if (stat.isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                }
            }
        });
}
}