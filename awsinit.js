const { s3, S3_BUCKET_NAME } = require("./src/config/aws");
const {
  CreateBucketCommand,
  PutBucketTaggingCommand,
} = require("@aws-sdk/client-s3");

const username1 = "n11240296@qut.edu.au";
const username2 = "n11280859@qut.edu.au";

async function createS3Bucket(bucketName) {
  const command = new CreateBucketCommand({ Bucket: bucketName });
  try {
    const response = await s3.send(command);
    console.log(response.Location);
  } catch (err) {
    if (err.name === "BucketAlreadyOwnedByYou") {
      console.log(`Bucket ${bucketName} already exists, proceeding...`);
    } else {
      console.error(err);
    }
  }
}

async function tagS3Bucket(bucketName, tags) {
  const command = new PutBucketTaggingCommand({
    Bucket: bucketName,
    Tagging: {
      TagSet: tags,
    },
  });
  try {
    const response = await s3.send(command);
    console.log("Bucket tagged successfully.", response);
  } catch (err) {
    console.error(err);
  }
}

async function provisionS3Bucket() {
  const bucketName = S3_BUCKET_NAME;
  const tags = [
    {
      Key: "Environment",
      Value: "Development",
    },
    {
      Key: "Group",
      Value: "group13",
    },
    {
      Key: "qut-username",
      Value: username1,
    },
    {
      Key: "qut-username2",
      Value: username2,
    },
  ];

  try {
    await createS3Bucket(bucketName);
    await tagS3Bucket(bucketName, tags);
    console.error("S3 provisioning process complete");
  } catch (err) {
    console.error("S3 bucket provisioning failed.");
    process.exit(1);
  }
}

// Execute the provisioning process.
provisionS3Bucket();
