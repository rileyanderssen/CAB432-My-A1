////////////////////////////////////////
// auth token error messages
////////////////////////////////////////

const MISSING_TOKEN = "Missing Token";
const TOKEN_EXPIRED = "Expired Token";
const TOKEN_INVALID = "Invalid Token";

const TOKEN_EXPIRED_SYS = "TokenExpiredError";

////////////////////////////////////////

////////////////////////////////////////
// file error messages
////////////////////////////////////////

const NO_FILE = "No file uploaded";
const DUPLICATE_TITLE = "Title must be unique";
const FILE_NOT_FOUND = "File not found";
const FILE_NOT_EXIST = "File does not exist";
const NO_FILES_UPLOADED = "No files have been uploaded yet";
const NO_PAGE_FILES = "No files found on this page";
const INVALID_PAGE_NO = "Invalid page number provided";

const UPLOAD_SUCCESS = "File uploaded successfully";
const DELETE_SUCCESS = "File deleted successfully";
const UPDATE_SUCCESS = "File updated successfully";

////////////////////////////////////////

////////////////////////////////////////
// transcode error messages
////////////////////////////////////////

const TRANSCODE_FAILED = "Transcoding failed";
const TRANSCODE_NOT_FOUND = "Transcode not found";
const NO_TRANSCODE = "No transcodes have been done yet";
const NO_PAGE_TRANSCODES = "No transcoded files found on this page";

const TRANSCODE_SUCCESS = "Transcoding completed successfully";
const T_DELETE_SUCCESS = "Transcode deleted successfully";
const T_UNSUPPORTED_FORMAT = "This format is unsupported";

////////////////////////////////////////

////////////////////////////////////////
// folder error messages
////////////////////////////////////////

const FOLDER_ALREADY_EXISTS = "Folder already exists";
const FOLDER_NOT_EXISTS = "Folder does not exist";

const FOLDER_SUCCESS = "Folder created successfully";
const D_DELETE_SUCCESS = "Folder deleted successfully";
const D_UPDATE_SUCCESS = "Folder updated successfully";

////////////////////////////////////////


module.exports = {
    FOLDER_ALREADY_EXISTS,
    FOLDER_SUCCESS,
    FOLDER_NOT_EXISTS,
    MISSING_TOKEN,
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_EXPIRED_SYS,
    NO_FILE,
    UPLOAD_SUCCESS,
    DUPLICATE_TITLE,
    FILE_NOT_FOUND,
    FILE_NOT_EXIST,
    DELETE_SUCCESS,
    UPDATE_SUCCESS,
    TRANSCODE_FAILED,
    TRANSCODE_SUCCESS,
    TRANSCODE_NOT_FOUND,
    T_DELETE_SUCCESS,
    D_DELETE_SUCCESS,
    D_UPDATE_SUCCESS,
    T_UNSUPPORTED_FORMAT,
    NO_FILES_UPLOADED,
    NO_PAGE_FILES,
    INVALID_PAGE_NO,
    NO_TRANSCODE,
    NO_PAGE_TRANSCODES
};