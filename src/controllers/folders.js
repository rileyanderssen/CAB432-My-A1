const Folder = require("../models/folder");
const {
    FOLDER_ALREADY_EXISTS,
    FOLDER_SUCCESS,
    FOLDER_NOT_EXISTS,
    D_DELETE_SUCCESS,
    D_UPDATE_SUCCESS
} = require("../constants/error");

exports.createFolder = (req, res) => {
    const folderName = req.body.folderName;
    const userId = req.userDetails.id;

    const folderStatus = Folder.create(userId, folderName);

    if (!folderStatus) {
        return res.status(400).json({ error: FOLDER_ALREADY_EXISTS });
    }

    return res.status(200).json({ message: FOLDER_SUCCESS });
}

exports.viewFolder = (req, res) => {
    const folderId = req.body.folderId;

    const folderContent = Folder.view(folderId);

    if (!folderContent) {
        return res.status(400).json({ error: FOLDER_NOT_EXISTS });
    }

    return res.status(200).json({ content: folderContent });
}

exports.viewAll = (req, res) => {
    const userId = req.userDetails.id;

    const allContent = Folder.all(userId);

    return res.status(200).json({ root: allContent });
}

exports.deleteFolder = (req, res) => {
    const folderId = req.body.folderId;

    const deleteStatus = Folder.delete(folderId);

    if (!deleteStatus) {
        return res.status(400).json({ error: FOLDER_NOT_EXISTS });
    }

    return res.status(200).json({ message: D_DELETE_SUCCESS });
}

exports.updateFolder = (req, res) => {
    const folderId = req.body.folderId;
    const newFolderName = req.body.newFolderName;

    console.log("Updating to ", newFolderName);

    const updateStatus = Folder.update(folderId, newFolderName);

    if (!updateStatus) {
        return res.status(400).json({ error: FOLDER_NOT_EXISTS });
    } 

    return res.status(200).json({ message: D_UPDATE_SUCCESS  });
}