const mongoose = require("mongoose");
const { GetSecretValue, DB_CONNECTION_STRING_NAME } = require("./src/aws/secretsManager");

// n11280559_13_connection_string_db -> this one
// group13-secret-mongo-connection-string

// move to secrets manager !!
const connectionString = "mongodb+srv://rileyanderssen_db_user:73T0gU9rSgvAxElz@cab432clusterrm.zqkfbrq.mongodb.net/?retryWrites=true&w=majority&appName=CAB432ClusterRM";


////////////////////////////////////////////////////
//// USE THIS WHEN ON EC2 ////////////////////////////
////////////////////////////////////////////////////


// async function connectToDatabase() {
//   try {
//     // fetch secret from AWS
//     const secret = await GetSecretValue(DB_CONNECTION_STRING_NAME);
//     const connectionString = secret.connectionString;

//     await mongoose.connect(connectionString, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Connected to MongoDB successfully");
//   } catch (err) {
//     console.error("Failed to connect to MongoDB:", err);
//   }
// }

// connectToDatabase();

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to mongo db successfully"))
.catch((err) => console.error("Failed to connect to mongo db: ", err))

const folderSchema = new mongoose.Schema({
    // note: no need to store folderId as document will have one assigned automatically: _id
    // note: the user key will come as a UUID from aws auth service
    userKey: { type: String, required: true },
    folderName: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
})

const fileSchema = new mongoose.Schema({
    // note: fileId with be created automatically by MongoDB
    userKey: { type: String, required: true },
    folderKey: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Folder' },
    title: { type: String, required: true },
    description: { type: String, required: false },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String, required: true }, // note: this will probs be S3 link
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
})

const transcodeSchema = new mongoose.Schema({
    userKey: { type: String, required: true },
    fileKey: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'File' },
    url: { type: String, required: true }, // this will be the S3 link
    format: { type: String, required: true },
    transcodedAt: { type: Date, default: Date.now }
})

const Folder = mongoose.model('Folder', folderSchema);
const File = mongoose.model('File', fileSchema);
const Transcode = mongoose.model('Transcode', transcodeSchema);
// module.exports = Folder;






// make shift database - REMOVE THIS WHEN POSSIBLE

const MockUserDB = [
    { id: 1, email: "testuser@gmail.com", password: "password" },
    { id: 2, email: "hello@gmail.com", password: "hello" },
    { id: 3, email: "otheruser@gmail.com", password: "otherpassword" },
]

const MockFileDB = [];

const MockTranscodeDB = [];

const MockFolderDB = [];

module.exports = {
    MockUserDB, // remove
    MockFileDB, // remove
    MockTranscodeDB, // remove
    MockFolderDB, // remove
    Folder,
    File,
    Transcode
}


// database connection string mongodb+srv://rileyanderssen_db_user:73T0gU9rSgvAxElz@cab432clusterrm.zqkfbrq.mongodb.net/?retryWrites=true&w=majority&appName=CAB432ClusterRM