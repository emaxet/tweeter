"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const mongoUtil     = require("./lib/util/mongo-connection.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoUtil.connectToServer((err) => {

  if (err) throw err;

  const db = mongoUtil.getDb();

  const DataHelpers = require("./lib/data-helpers.js")(db);

  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  app.use("/tweets", tweetsRoutes);

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
