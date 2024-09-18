const express = require("express");
const cloudinaryUpload = require("./cloudinary");
const googleCloudUpload = require("./googleCloud");
const awsUpload = require("./aws");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/cloudinary-upload", cloudinaryUpload);
  app.use("/api/google-cloud-upload", googleCloudUpload);
  app.use("/api/aws-upload", awsUpload);
};
