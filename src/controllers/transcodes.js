const Transcode = require("../models/transcode");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const {
    TRANSCODE_FAILED,
    FILE_NOT_FOUND,
    TRANSCODE_SUCCESS,
    TRANSCODE_NOT_FOUND,
    T_DELETE_SUCCESS,
    T_UNSUPPORTED_FORMAT,
    INVALID_PAGE_NO,
    NO_TRANSCODE,
    NO_PAGE_TRANSCODES
} = require("../constants/error");
const { 
    DeterminePaginationResponse 
} = require("../helpers/data");

// NOTE ->> NEED TO TELL USER THAT THEY HAVE ALREADY 
// TRANSCODED THE FILE IF THEY TRY TRANSCODING THE SAME ONE AGAIN

// OTHERWISE AN ERRROR OCCURS
// BECAUSE WE REMOVE THE FILE WHEN TRANSCODING

// different speeds
// ultrafast
// superfast
// veryfast
// faster
// fast
// medium
// slow
// slower
// veryslow
// placebo

// lower audio bit rate for higher speed
// 192k
// 128k
// 96k

// higher crf for higher speed
// 28
// 23

// lower resolution for higher speed

// threads
// "threads 0" - auto detect cpu cores
// "threads 1" uses 1
// "threads 4" uses 4
// "threads 8" uses 8
// "threads 16" uses 16
// ...

// note: increasing threads increases cpu usage


////// for load-testing - new file/route
// const concurrentJobs = 15; // Adjust based on CPU cores
// const jobRequests = [];

// for (let i = 0; i < concurrentJobs; i++) {
//     jobRequests.push(
//         fetch("http://your-server-ip/transcode", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 fileId: "test-video-id", // pre-uploaded small video file
//                 transcodeType: "webm"    // slowest for CPU load
//             })
//         })
//             .then(res => res.json())
//             .then(data => console.log(`Job ${i+1} started`, data))
//             .catch(err => console.error(`Job ${i+1} failed`, err))
//     );
// }

// Promise.all(jobRequests).then(() => console.log("Load test triggered"));

exports.transcodeFile = (req, res) => {
    const fileId = req.body.fileId;
    let userId = "";
    let isLoadTest = false;
    if (req.userDetails) {
        userId = req.userDetails.id;
    } else {
        userId = req.body.userIdLoadTest;
        isLoadTest = true;
    }

    const transcodeType = req.body.transcodeType;
    const inputPath = Transcode.fileInputPath(userId, fileId);

    const availableTranscodeTypes = [
        "mp4",
        "mkv",
        "mov",
        "webm",
    ]

    let transcodeTo = transcodeType;
    if (!transcodeTo) {
        transcodeTo = "mp4";
    }

    if (!inputPath) {
        return res.status(400).json({ error: FILE_NOT_FOUND });
    }

    if (!availableTranscodeTypes.includes(transcodeTo)) {
        return res.status(400).json({ error: T_UNSUPPORTED_FORMAT });
    }

    const outputPath = path.join("uploads", `${Date.now()}_output.${transcodeTo}`);

    let videoCodec = "libx264";
    let audioCodec = "aac";

    if (transcodeTo === "webm") {
        videoCodec = "libvpx-vp9"; 
        audioCodec = "libopus";    
    }

    // NOTE -> webm is the slowest format
    // use this cpu downtime on EC2 potentially

    // NOTE -> added process log so that it can be view in ec2 log
    // to determine how far in the transcode is
    // or if ec2 has crashed etc

    try {
        ffmpeg(inputPath)
            .outputOptions([
                `-c:v ${videoCodec}`,
                "-preset medium",
                "-crf 18",
                "-vf scale=1920:1080",  
                `-c:a ${audioCodec}`,
                "-b:a 192k",
                "-threads 0",
            ])
            .on("start", (cmd) => console.log("FFmpeg command: ", cmd))
            .on("progress", (p) => console.log(`Processing: ${p.percent.toFixed(2)}`))
            .on("error", () => {
                res.status(500).json({ error: TRANSCODE_FAILED });
            })
            .on("end", () => {
                if (!isLoadTest) {
                    fs.unlinkSync(inputPath);
                }

                // S3 -> this is where you will upload the transcoded file 
                // and then parse the S3 location link into the put transcode function
                // instead place of download url
                // NOTE: below this function I added some commented code from Claud AI to show the process

                const downloadUrl = `${req.protocol}://${req.get("host")}/videos/${path.basename(outputPath)}`;
                Transcode.putTranscode(outputPath, downloadUrl, fileId, transcodeTo, userId);

                res.json({ message: TRANSCODE_SUCCESS, path: outputPath, downloadUrl: downloadUrl });
            })
            .save(outputPath);

            // .on("end", async () => {
            //     try {
            //         if (!isLoadTest) {
            //             fs.unlinkSync(inputPath);
            //         }

            //         // Upload to S3
            //         const fileContent = fs.readFileSync(outputPath);
            //         const fileName = `transcoded/${Date.now()}-${path.basename(outputPath)}`;
                    
            //         const uploadParams = {
            //             Bucket: 'your-bucket-name',
            //             Key: fileName,
            //             Body: fileContent,
            //             ContentType: 'video/mp4' // or appropriate mime type
            //         };

            //         const s3Result = await s3.upload(uploadParams).promise();
            //         console.log("S3 upload successful:", s3Result.Location);

            //         // Clean up local file after S3 upload
            //         fs.unlinkSync(outputPath);

            //         // Use S3 URL instead of local URL
            //         const downloadUrl = s3Result.Location;
            //         Transcode.putTranscode(outputPath, downloadUrl, fileId, transcodeTo, userId);

            //         res.json({ 
            //             message: TRANSCODE_SUCCESS, 
            //             path: s3Result.Location, 
            //             downloadUrl: downloadUrl 
            //         });

            //     } catch (s3Error) {
            //         console.error("S3 upload failed:", s3Error);
            //         res.status(500).json({ error: "S3 upload failed" });
            //     }
            // })
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

// S3 -> this will need to be replaced with the S3 link to download it
// let me know when S3 is done and I can do this part as it is DB related 
exports.downloadTranscode = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(400).json({ error: FILE_NOT_FOUND });
    }
}

exports.getAllTranscodes = (req, res) => {
    const userId = req.userDetails.id;
    let pageNumber = req.body.pageNumber;

    if (!pageNumber) {
        pageNumber = 1;
    }

    if (!Number.isInteger(Number(pageNumber)) || Number(pageNumber) <= 0) {
        return res.status(400).json({ error: INVALID_PAGE_NO });
    }

    pageNumber = parseInt(pageNumber);
    const transcodes = Transcode.getAll(userId, pageNumber);

    if (transcodes.length === 0) {
        if (pageNumber === 1) {
            return res.status(400).json({ error: NO_TRANSCODE });
        } else {
            return res.status(400).json({ error: NO_PAGE_TRANSCODES });
        }
    }

    res.status(200).json({ 
        transcodes: transcodes,
        pagination: DeterminePaginationResponse(pageNumber, transcodes.length)
    });
}

exports.getTranscodeById = (req, res) => {
    const userId = req.userDetails.id;
    const transcodeId = req.body.transcodeId;

    const transcode = Transcode.getById(userId, transcodeId);

    if (!transcode) {
        return res.status(400).json({ error: TRANSCODE_NOT_FOUND });
    }

    return res.status(200).json({ transcode: transcode });
}

exports.deleteTranscodeById = (req, res) => {
    const userId = req.userDetails.id;
    const transcodeId = req.body.transcodeId;

    const transcodeRecord = Transcode.getById(userId, transcodeId);
    if (!transcodeRecord) {
        return res.status(400).json({ error: TRANSCODE_NOT_FOUND });
    }

    const filePath = transcodeRecord.filePath;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    const deleteStatus = Transcode.deleteById(userId, transcodeId);

    if (!deleteStatus) {
        return res.status(400).json({ error: TRANSCODE_NOT_FOUND });
    }

    return res.status(200).json({ message: T_DELETE_SUCCESS });
}