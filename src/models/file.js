const {
    MockFileDB
} = require("../../db");
const { 
    DeterminePaginationBounds 
} = require("../helpers/data");

const { v4: uuidv4 } = require('uuid');

exports.upload = (
    userId,
    userTitle,
    folderId,
    userDescription,
    fileName,
    fileType,
    filePath,
    fileSize,
) => {
    const fileId = uuidv4();
    const uploadedAt = new Date().toISOString();

    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].title === userTitle && MockFileDB[i].userId === userId) {
            return false;
        }
    }

    MockFileDB.push({
        userId: userId,
        fileId: fileId,
        title: userTitle,
        folderId: folderId,
        description: userDescription,
        fileName: fileName,
        fileType: fileType,
        filePath: filePath,
        fileSize: fileSize,
        uploadedAt: uploadedAt,
    });

    return true;
}

exports.getAll = (userId, pageNumber, titleFilter) => {
    const { upperBound, lowerBound } = DeterminePaginationBounds(pageNumber);

    let MockFileDBFiltered = MockFileDB;
    if (titleFilter !== "") {
        MockFileDBFiltered = MockFileDB.filter(file =>
            file.title.toLowerCase().includes(titleFilter.toLowerCase())
        );
    }   

    const userFiles = [];
    for (let i = lowerBound; i <= upperBound; i++) {
        if (MockFileDBFiltered[i]) {
            if (MockFileDBFiltered[i].userId === userId) {
                userFiles.push(MockFileDBFiltered[i]);
            }
        } else {
            return userFiles;
        }
    }
    
    return userFiles;
}

exports.getByTitle = (userId, title) => {
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].title === title && MockFileDB[i].userId === userId) {
            return MockFileDB[i];
        }
    }

    return null;
}

exports.getById = (userId, fileId) => {
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].fileId === fileId && MockFileDB[i].userId === userId) {
            return MockFileDB[i];
        }
    }

    return null;
}

exports.deleteByTitle = (userId, title) => {
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].title === title && MockFileDB[i].userId === userId) {
            MockFileDB.splice(i, 1);       
            return true;      
        }
    }

    return false;
}

exports.deleteById = (userId, fileId) => {
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].fileId === fileId && MockFileDB[i].userId === userId) {
            MockFileDB.splice(i, 1);       
            return true;      
        }
    }

    return false;
}

exports.updateByTitle = (userId, oldTitle, newTitle, newDescription) => {
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].title === oldTitle && MockFileDB[i].userId === userId) {
            if (newTitle !== "") {
                MockFileDB[i].title = newTitle;
            }
            
            MockFileDB[i].description = newDescription;
            return true;
        }
    }

    return false;
}

exports.updateById = (userId, fileId, newTitle, newDescription) => {
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].fileId === fileId && MockFileDB[i].userId === userId) {
            if (newTitle !== "") {
                MockFileDB[i].title = newTitle;
            }
            
            MockFileDB[i].description = newDescription;
            return true;
        }
    }

    return false;
}