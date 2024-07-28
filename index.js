const express = require("express");

if (process.argv[2] === "DEV") require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

require("./routes/routes")(app);

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});
