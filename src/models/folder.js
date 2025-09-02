const {
    MockFolderDB,
    MockFileDB
} = require("../../db");
const { v4: uuidv4 } = require('uuid');

exports.create = (userId, folderName) => {
    const folderId = uuidv4();
    const createdAt = new Date().toISOString();

    for (let i = 0; i < MockFolderDB.length; i++) {
        if (MockFolderDB[i].folderName === folderName && MockFolderDB[i].userId === userId) {
            return false;
        }
    }

    MockFolderDB.push({
        folderId: folderId,
        userId: userId,
        folderName: folderName,
        createdAt: createdAt,
    })

    return true;
}

exports.view = (folderId) => {
    if (this.exists(folderId)) {
        const folderContent = [];

        for (let i = 0; i < MockFileDB.length; i++) {
            if (MockFileDB[i].folderId === folderId) {
                folderContent.push(MockFileDB[i]);
            }
        }

        return folderContent;
    }

    return null;
}

exports.delete = (folderId) => {
    if (!this.exists(folderId)) {
        return false;
    }

    // delete all files in this folder
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].folderId === folderId) {
            MockFileDB.splice(i, 1);
        }
    }

    // delete the folder
    for (let i = 0; i < MockFolderDB.length; i++) {
        if (MockFolderDB[i].folderId === folderId) {
            MockFolderDB.splice(i, 1);
            return true;
        }
    }

    return false;
}

exports.update = (folderId, newFolderName) => {
    for (let i = 0; i < MockFolderDB.length; i++) {
        if (MockFolderDB[i].folderId === folderId) {
            MockFolderDB[i].folderName = newFolderName;
            return true;
        }
    }

    return false;
}

exports.exists = (folderId) => {
    for (let i = 0; i < MockFolderDB.length; i++) {
        if (MockFolderDB[i].folderId === folderId) {
            return true;
        }
    }

    return false;
}

exports.all = (userId) => {
    const allContent = [];
    // get all folders related to user
    for (let i = 0; i < MockFolderDB.length; i++) {
        if (MockFolderDB[i].userId === userId) {
            const folderId = MockFolderDB[i].folderId;
            const folderName = MockFolderDB[i].folderName;
            const content = [];
            for (let j = 0; j < MockFileDB.length; j++) {
                if (MockFileDB[j].folderId === folderId) {
                    content.push(MockFileDB[j]);
                }
            }

            allContent.push({ folder: folderName, folderId: folderId, content: content });
        }
    }

    // get all files not in folders related to user
    for (let i = 0; i < MockFileDB.length; i++) {
        if (MockFileDB[i].userId === userId && !MockFileDB[i].folderId) {
            allContent.push(MockFileDB[i]);
        }
    }

    return allContent;
}