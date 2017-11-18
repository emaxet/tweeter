"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const ObjectId      = require("mongodb").ObjectID;

// Defines helper functions for saving and getting tweets, using the database `db`

module.exports = function makeDataHelpers(db) {
  return {

    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },
    // Get all tweets in `db`, sorted by newest first

    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) throw error;
        callback(null, tweets.sort(sortNewestFirst));
      });
    }
  };
}
