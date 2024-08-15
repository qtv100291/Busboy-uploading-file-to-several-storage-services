const express = require("express");
const busboy = require("busboy");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", async (req, res) => {
  try {
    const createUploader = cloudinary.uploader.upload_stream(
      async (err, image) => {
        // put your code here, I add example code below
        console.log(err);
        if (err) return res.status(500).json({ message: "server error" });
        return res.status(200).json({
          message: "Uploaded the file successfully",
          urlImage: image.url,
        });
      }
    );

    const bb = busboy({ headers: req.headers });

    bb.on("file", async function (_, file, info) {
      file.pipe(createUploader);
    });

    req.pipe(bb);
  } catch (err) {
    console.log("error : ", err);
  }
});

module.exports = router;
