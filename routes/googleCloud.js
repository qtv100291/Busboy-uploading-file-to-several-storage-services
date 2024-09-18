const express = require("express");
const busboy = require("busboy");

const router = express.Router();

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  keyFilename: "assets/busboy-upload-test.json", // path to your json key file
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

const hostname = "https://storage.googleapis.com";

router.post("/", async (req, res) => {
  try {
    const bucket = await storage.bucket(bucketName);
    const bb = busboy({ headers: req.headers });
    let fileUrl;
    bb.on("file", (_, file, info) => {
      const { filename } = info;
      const destFile = bucket.file(filename);
      const writeStream = destFile.createWriteStream();
      file.pipe(writeStream);
      file.on("close", () => {
        fileUrl = `${hostname}/${bucketName}/${filename}`;
      });
    });
    bb.on("close", () => {
      res.status(200).json({
        message: "Uploaded the file successfully",
        url: fileUrl, // make sure your bucket is set to public for all user
      });
    });
    req.pipe(bb);
  } catch (err) {
    console.log("error : ", err);
  }
});

module.exports = router;
