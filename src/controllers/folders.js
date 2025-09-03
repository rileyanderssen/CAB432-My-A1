const Folder = require("../models/folder");
const {
    FOLDER_ALREADY_EXISTS,
    FOLDER_SUCCESS,
    FOLDER_NOT_EXISTS,
    D_DELETE_SUCCESS,
    D_UPDATE_SUCCESS
} = require("../constants/error");

exports.createFolder = async (req, res) => {
    const folderName = req.body.folderName;
    const userId = req.userDetails.id;

    const folderStatus = await Folder.create(userId, folderName);

    if (!folderStatus) {
        return res.status(400).json({ error: FOLDER_ALREADY_EXISTS });
    }

    return res.status(200).json({ message: FOLDER_SUCCESS });
}

exports.viewFolder = async (req, res) => {
    const folderId = req.body.folderId;

    const folderContent = await Folder.view(folderId);

    if (!folderContent) {
        return res.status(400).json({ error: FOLDER_NOT_EXISTS });
    }

    return res.status(200).json({ content: folderContent });
}

exports.viewAll = async (req, res) => {
    const userId = req.userDetails.id;

    const allContent = await Folder.all(userId);

    return res.status(200).json({ root: allContent });
}

exports.deleteFolder = async (req, res) => {
    const folderId = req.body.folderId;

    const deleteStatus = await Folder.delete(folderId);

    if (!deleteStatus) {
        return res.status(400).json({ error: FOLDER_NOT_EXISTS });
    }

    return res.status(200).json({ message: D_DELETE_SUCCESS });
}

exports.updateFolder = async (req, res) => {
    const folderId = req.body.folderId;
    const newFolderName = req.body.newFolderName;

    const updateStatus = await Folder.update(folderId, newFolderName);


    if (updateStatus === "Not Exists" || updateStatus === "Invalid ID") {
        return res.status(404).json({ error: FOLDER_NOT_EXISTS });
    } else if (updateStatus === "Exists") {
        return res.status(400).json({ error: "Cannot have the same folder name as another folder." });
    } 

    if (!updateStatus) {
        return res.status(400).json({ error: FOLDER_NOT_EXISTS });
    }

    return res.status(200).json({ message: D_UPDATE_SUCCESS  });
}