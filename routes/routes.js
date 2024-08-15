const express = require("express");
const cloudinaryUpload = require("./cloudinary");
const googleCloudUpload = require("./googleCloud");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/cloudinary-upload", cloudinaryUpload);
  app.use("/api/google-cloud-upload", googleCloudUpload);
};
