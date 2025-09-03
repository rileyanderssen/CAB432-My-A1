const {
    MockFileDB, // remove this
    File
} = require("../../db");
const { 
    DeterminePaginationBounds 
} = require("../helpers/data");
const mongoose = require('mongoose');

exports.upload = async (
    userId,
    userTitle,
    folderId, 
    userDescription,
    fileName,
    fileType,
    filePath,
    fileSize,
) => {
    try {
        const existingFile = await File.findOne({ userKey: userId, title: userTitle });
        if (existingFile) {
            return false;
        }

        const file = new File({
            userKey: userId,
            folderKey: folderId || null,
            title: userTitle,
            description: userDescription,
            fileName: fileName,
            fileType: fileType,
            filePath: filePath,
            fileSize: fileSize,
        })

        await file.save();
    } catch (err) {
        console.log("Error caught: ", err);
    }
}

exports.getAll = async (userId, pageNumber, titleFilter) => {
    const pageSize = 5;

    const filter = { userKey: userId };
    if (titleFilter) {
        filter.title = { $regex: titleFilter, $options: "i" };
    }

    const files = await File.find(filter)
                            .skip((pageNumber - 1) * pageSize)
                            .limit(pageSize);
    return files;
}

exports.getByTitle = async (userId, title) => {
    const file = await File.findOne({ title: title, userKey: userId });
    if (file) {
        return file;
    }


    return null;
}

exports.getById =  async (userId, fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return null;
    }

    const file = await File.findOne({ _id: fileId, userKey: userId });
    if (file) {
        return file;
    }

    return null;
}

exports.deleteByTitle = async (userId, title) => {
    const result = await File.deleteOne({ title: title, userKey: userId });
    
    return result.deletedCount === 1;
}

exports.deleteById = async (userId, fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return "Invalid ID";
    }

    const deletedFile = await File.deleteOne({ _id: fileId, userKey: userId });
    if (deletedFile) {
        return true;
    }

    return false;
}

exports.updateByTitle = async (userId, oldTitle, newTitle, newDescription) => {
    const exists = await File.findOne({ title: oldTitle, userKey: userId });
    if (!exists) {
        return "Not Exists";
    }

    const updatedFileExists = await File.findOne({ title: newTitle, userKey: userId });
    if (updatedFileExists) {
        return "Exists";
    }

    await File.updateOne(
        { userKey: userId, title: oldTitle },  
        { $set: { description: newDescription, title: newTitle } }  
    );

    return "Success";
}

exports.updateById = async (userId, fileId, newTitle, newDescription) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return "Invalid ID";
    }

    const exists = await File.findOne({ _id: fileId, userKey: userId });
    if (!exists) {
        return "Not Exists";
    }

    const updatedFileExists = await File.findOne({ title: newTitle, userKey: userId });
    if (updatedFileExists) {
        return "Exists";
    }

    await File.updateOne(
        { userKey: userId, _id: fileId },  
        { $set: { description: newDescription, title: newTitle } }  
    );

    return "Success";
}