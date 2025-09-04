const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function getPresignedUrl(key, method = "GET", expiresIn = 3600) {
  let command;
  if (method === "GET") {
    command = new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key });
  } else {
    throw new Error("Invalid method for presigned URL");
  }

  return await getSignedUrl(s3, command, { expiresIn });
}

module.exports = {
  getPresignedUrl,
};
