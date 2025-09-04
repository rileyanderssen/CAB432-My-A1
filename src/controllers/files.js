const File = require("../models/file");
const { DeterminePaginationResponse } = require("../helpers/data");
const {
  NO_FILE,
  UPLOAD_SUCCESS,
  DUPLICATE_TITLE,
  FILE_NOT_FOUND,
  FILE_NOT_EXIST,
  DELETE_SUCCESS,
  UPDATE_SUCCESS,
  FOLDER_NOT_EXISTS,
  NO_PAGE_FILES,
  NO_FILES_UPLOADED,
  INVALID_PAGE_NO,
} = require("../constants/error");
const { s3 } = require("../config/aws");

exports.uploadFile = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: NO_FILE });
  }

  const userId = req.userDetails.id;
  const userTitle = req.body.userTitle;
  const userDescription = req.body.userDescription;
  const folderId = req.body.folderId;
  const fileName = file.originalname;
  const fileType = file.mimetype;
  const filePath = file.path;
  const fileSize = file.size;

  const uploadStatus = File.upload(
    userId,
    userTitle,
    folderId,
    userDescription,
    fileName,
    fileType,
    filePath,
    fileSize,
  );

  if (!uploadStatus) {
    return res.status(400).json({ error: DUPLICATE_TITLE });
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: filePath,
  });

  await s3.send(command);

  return res.status(200).json({ message: UPLOAD_SUCCESS });
};

exports.getAllFiles = async (req, res) => {
  const userId = req.userDetails.id;
  let pageNumber = req.body.pageNumber;
  let titleFilter = req.body.titleFilter;

  if (!titleFilter) {
    titleFilter = "";
  }

  if (!pageNumber) {
    pageNumber = 1;
  }

  if (!Number.isInteger(Number(pageNumber)) || Number(pageNumber) <= 0) {
    return res.status(400).json({ error: INVALID_PAGE_NO });
  }

  pageNumber = parseInt(pageNumber);
  const files = await File.getAll(userId, pageNumber, titleFilter);

  if (files.length === 0) {
    if (pageNumber === 1) {
      return res.status(200).json({ message: NO_FILES_UPLOADED });
    } else {
      return res.status(200).json({ message: NO_PAGE_FILES });
    }
  }

  return res.status(200).json({
    files: files,
    pagination: DeterminePaginationResponse(pageNumber, files.length),
  });
};

exports.getFileByTitle = async (req, res) => {
  const title = req.body.title;
  const userId = req.userDetails.id;

  const file = await File.getByTitle(userId, title);

  if (!file) {
    return res.status(400).json({ error: FILE_NOT_FOUND });
  }

  return res.status(200).json({ file: file });
};

exports.getFileById = async (req, res) => {
  const fileId = req.body.fileId;
  const userId = req.userDetails.id;

  const file = await File.getById(userId, fileId);

  if (!file) {
    return res.status(400).json({ error: FILE_NOT_FOUND });
  }

  return res.status(200).json({ file: file });
};

exports.deleteFileByTitle = async (req, res) => {
  const title = req.body.title;
  const userId = req.userDetails.id;

  const deleteStatus = await File.deleteByTitle(userId, title);

  if (!deleteStatus) {
    return res.status(400).json({ error: FILE_NOT_EXIST });
  }

  return res.status(200).json({ message: DELETE_SUCCESS });
};

exports.deleteFileById = async (req, res) => {
  const fileId = req.body.fileId;
  const userId = req.userDetails.id;

  const deleteStatus = await File.deleteById(userId, fileId);

  if (!deleteStatus) {
    return res.status(400).json({ error: FILE_NOT_EXIST });
  }

  return res.status(200).json({ message: DELETE_SUCCESS });
};

exports.updateFileByTitle = async (req, res) => {
  const oldTitle = req.body.title;
  const newTitle = req.body.newTitle;
  const newDescription = req.body.newDescription;
  const userId = req.userDetails.id;

  const updateStatus = await File.updateByTitle(
    userId,
    oldTitle,
    newTitle,
    newDescription,
  );
  if (updateStatus === "Not Exists" || updateStatus === "Invalid ID") {
    return res.status(404).json({ error: FILE_NOT_EXIST });
  } else if (updateStatus === "Exists") {
    return res
      .status(400)
      .json({ error: "Cannot have the same title as another file." });
  }

  if (!updateStatus) {
    return res.status(400).json({ error: FILE_NOT_EXIST });
  }

  return res.status(200).json({
    message: UPDATE_SUCCESS,
    newTitle: newTitle,
    newDescription: newDescription,
  });
};

exports.updateFileById = async (req, res) => {
  const fileId = req.body.fileId;
  const newTitle = req.body.newTitle;
  const newDescription = req.body.newDescription;
  const userId = req.userDetails.id;

  const updateStatus = await File.updateById(
    userId,
    fileId,
    newTitle,
    newDescription,
  );
  if (updateStatus === "Not Exists" || updateStatus === "Invalid ID") {
    return res.status(404).json({ error: FILE_NOT_EXIST });
  } else if (updateStatus === "Exists") {
    return res
      .status(400)
      .json({ error: "Cannot have the same title has another file." });
  }

  if (!updateStatus) {
    return res.status(400).json({ error: FILE_NOT_EXIST });
  }

  return res.status(200).json({
    message: UPDATE_SUCCESS,
    newTitle: newTitle,
    newDescription: newDescription,
  });
};
