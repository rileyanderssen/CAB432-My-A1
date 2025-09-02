const {
    MockTranscodeDB,
    MockFileDB,
} = require("../../db");
const { 
    DeterminePaginationBounds 
} = require("../helpers/data");

const { v4: uuidv4 } = require('uuid');

exports.fileInputPath = (
    userId,
    fileId
) => {
    let inputPath = "";
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].fileId === fileId && MockFileDB[i].userId === userId) {
            inputPath = MockFileDB[i].filePath;
            break;
        }
    }

    if (!inputPath) {
        return "";
    }

    return inputPath;
}

// technically, we don't need to store userId in most places because fileId is unique to a user
// however, to make using a mock database easier (without joins), we will add userId in for now
exports.putTranscode = (filePath, downloadUrl, fileId, format, userId) => {
    const transcodeId = uuidv4();
    const transcodedAt = new Date().toISOString();

    MockTranscodeDB.push({
        transcodeId: transcodeId,
        userId: userId,
        fileId: fileId,
        downloadUrl: downloadUrl,
        format: format,
        filePath: filePath,
        transcodedAt: transcodedAt,
    })
}

exports.getAll = (userId, pageNumber) => {
    const { upperBound, lowerBound } = DeterminePaginationBounds(pageNumber);
    
    const allTranscodes = [];
    for (let i = lowerBound; i <= upperBound; i++) {
        if (MockTranscodeDB[i]) {
            if (MockTranscodeDB[i].userId === userId) {
                allTranscodes.push(MockTranscodeDB[i]);
            }
        } else {
            return allTranscodes;
        }
    }

    return allTranscodes;
}

exports.getById = (userId, transcodeId) => {
    for (let i = 0; i < MockTranscodeDB.length; i++) {
        if (MockTranscodeDB[i].transcodeId === transcodeId && MockTranscodeDB[i].userId === userId) {
            return MockTranscodeDB[i];
        }
    }

    return null;
}

exports.deleteById = (userId, transcodeId) => {
    for (let i = 0; i < MockTranscodeDB.length; i++) {
        if (MockTranscodeDB[i].userId === userId && MockTranscodeDB[i].transcodeId === transcodeId) {
            MockTranscodeDB.splice(i, 1);
            return true;
        }
    }

    return false;
}