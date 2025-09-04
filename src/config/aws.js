const { S3Client } = require("@aws-sdk/client-s3");

// TODO: Get these using some getSecret helper function
const AWS_REGION = "ap-southeast-2";
// const AWS_ACCESS_KEY_ID = "sample";
// const AWS_SECRET_ACCESS_KEY = "sample";
const S3_BUCKET_NAME = "group13-0f29a7d0-e7b6-44b2-9ab3-a20bd8ec50b8";

const s3 = new S3Client({ region: this.AWS_REGION });

module.exports = {
  s3,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
};
