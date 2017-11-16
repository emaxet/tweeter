"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const mongoUtil     = require("./lib/util/mongo-connection.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// The in-memory database of tweets. It's a basic object with an array in it.
// const db = require("./lib/in-memory-db");
mongoUtil.connectToServer((err) => {

  if (err) throw err;

  const db = mongoUtil.getDb();

  db.collection("tweets").find().toArray((err, tweets) => {

  const DataHelpers = require("./lib/data-helpers.js")(tweets);

  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  app.use("/tweets", tweetsRoutes);

  db.close();

  });
});
  // The `data-helpers` module provides an interface to the database of tweets.
  // This simple interface layer has a big benefit: we could switch out the
  // actual database it uses and see little to no changes elsewhere in the code
  // (hint hint).
  //
  // Because it exports a function that expects the `db` as a parameter, we can
  // require it and pass the `db` parameter immediately:


  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
  // so it can define routes that use it to interact with the data layer.



  // Mount the tweets routes at the "/tweets" path prefix:


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
