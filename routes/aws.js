const express = require("express");
const busboy = require("busboy");
const AWS = require("aws-sdk");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const router = express.Router();

// for AWS SDK V3
const client = new S3Client({
  credentials: fromEnv(),
  region: process.env.S3_REGION,
});

router.post("/v3", async (req, res) => {
  try {
    const bb = busboy({ headers: req.headers });
    const uploadPromise = [];
    bb.on("file", (_, file, info) => {
      const { filename, mimeType } = info;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: file,
        ContentType: mimeType,
      };
      const uploadToS3 = new Upload({ client, params });
      uploadPromise.push(uploadToS3.done());
    });
    bb.on("close", async () => {
      const [result] = await Promise.all(uploadPromise);
      if (result) {
        res.status(200).json({
          message: "Uploaded the file successfully",
          url: result.Location, // make sure your bucket is set to public for all user
        });
      }
    });
    req.pipe(bb);
  } catch (err) {
    console.error(err);
  }
});

// for AWS SDK V2
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.post("/v2", async (req, res) => {
  try {
    const bb = busboy({ headers: req.headers });
    const uploadPromise = [];
    bb.on("file", (_, file, info) => {
      const { filename, mimeType } = info;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: file,
        ContentType: mimeType,
      };

      uploadPromise.push(s3.upload(params).promise());
    });
    bb.on("close", async () => {
      const [result] = await Promise.all(uploadPromise);
      if (result) {
        res.status(200).json({
          message: "Uploaded the file successfully",
          url: result.Location, // make sure your bucket is set to public for all user
        });
      }
    });
    req.pipe(bb);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
