const express = require("express");
const cloudinaryUpload = require("./cloudinary");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/cloudinary-upload", cloudinaryUpload);
};
