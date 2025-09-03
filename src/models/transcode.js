const {
    MockFileDB, // remove
    Transcode,
    File
} = require("../../db");
const { 
    DeterminePaginationBounds 
} = require("../helpers/data");
const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');

// S3 - will need to fetch the url to the S3 location here
// where the transcoded file is stored after transcoding
exports.fileInputPath = async (
    userId,
    fileId
) => {
    let inputPath = "";
    const file = await File.findOne({ userKey: userId, _id: fileId });
    if (file) {
        return file.filePath;
    }

    return null;
}

// filePath is redundant now, we can do a code clean up later
exports.putTranscode = async (filePath, downloadUrl, fileId, format, userId) => {
    const transcode = new Transcode({
        userKey: userId,
        fileKey: fileId,
        url: downloadUrl, // S3 -> this will be the link to S3 location
        format: format,
    })

    await transcode.save();
}

exports.getAll = async (userId, pageNumber) => {
    const pageSize = 5;

    const transcodes = await Transcode
                                .find({ userKey: userId })
                                .skip((pageNumber - 1) * pageSize)
                                .limit(pageSize)

    return transcodes;
    
}

exports.getById = async (userId, transcodeId) => {
    if (!mongoose.Types.ObjectId.isValid(transcodeId)) {
        return null;
    }

    const transcode = await Transcode.find({ userKey: userId, _id: transcodeId });
    if (transcode) {
        return transcode;
    }

    return null;
}

exports.deleteById = async (userId, transcodeId) => {
    if (!mongoose.Types.ObjectId.isValid(transcodeId)) {
        return false;
    }

    const deletedTranscode = await Transcode.deleteOne({ _id: transcodeId, userKey: userId });
    if (deletedTranscode) {
        return true;
    }

    return false;
}