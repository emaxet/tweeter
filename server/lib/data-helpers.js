"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const mongoUtil     = require("./util/mongo-connection.js");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.tweets.push(newTweet);
        callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first

    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
        callback(null, db.sort(sortNewestFirst));
    }

  };
}
