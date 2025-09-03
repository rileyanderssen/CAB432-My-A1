const {
    Folder,
    File
} = require("../../db");
const mongoose = require('mongoose');

exports.create = async (userId, folderName) => {
    try {
        const existingFolder = await Folder.findOne({ userKey: userId, folderName: folderName });
        if (existingFolder) {
            return false;
        }

        const folder = new Folder({
            userKey: userId,
            folderName: folderName,
        })

        await folder.save();
    } catch (err) {
        console.log("Error caught: ", e);
    }

    return true;
}

exports.view = async (folderId) => {
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return null;
    }

    const files = await File.find({ folderKey: folderId });
    if (files) {
        return files;
    }

    return null;
}

exports.delete = async (folderId) => {
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return false;
    }

    // delete files in folder first
    await File.deleteMany({ folderKey: folderId });

    // delete folder
    const result = await Folder.deleteOne({ _id: folderId });
    if (result.deletedCount > 0) {
        return true;
    }

    return false;
}

exports.update = async (folderId, newFolderName) => {
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return false;
    }

    const exists = await Folder.findOne({ _id: folderId });
    if (!exists) {
        return "Not Exists";
    }

    const updatedFolderExists = await Folder.findOne({ folderName: newFolderName, _id: folderId });
    if (updatedFolderExists) {
        return "Exists";
    }

    await Folder.updateOne(
        { _id: folderId },
        { $set: { folderName: newFolderName } }
    )

    return "Success";
}

exports.all = async (userId) => {
    const allContent = [];
    const folders = await Folder.find({ userKey: userId });
    for (let i = 0; i < folders.length; i++) {
        const folderId = folders[i]._id;
        const folderName = folders[i].folderName;
        const content = [];

        const files = await File.find({ folderKey: folderId });
        content.push(files);

        allContent.push({ folder: folderName, folderId: folderId, content: content });
    }

    const files = await File.find({ folderKey: null });
    allContent.push(files);

    return allContent;
}