"use strict";

const userHelper    = require("../lib/util/user-helper");
const express       = require('express');
const app           = express();
const mongoUtil     = require("../lib/util/mongo-connection");
const ObjectId      = require('mongodb').ObjectID;

const tweetsRoutes  = express.Router();

app.use((req, res, next) => {
  app.locals.userID = req.session.userID ? req.session.userID : null;
  next();
});

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    const db = mongoUtil.getDb();
    const userDoc = db.collection('users').find({ userID: req.session.user_id }).toArray().then((userDoc) => {
      if(userDoc[0].userID === req.session.user_id) {
        console.log("match");
        const tweet = {
          user: userDoc[0],
          content: {
            text: req.body.text
          },
          created_at: Date.now(),
          likes: 0
        };
        console.log(tweet);
        DataHelpers.saveTweet(tweet, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          } else {
            res.status(201).send();
            return;
          }
        });
      }
    });
  });


      // const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
      // const tweet = {
      //   user: user,
      //   content: {
      //     text: req.body.text
      //   },
      //   created_at: Date.now(),
      //   likes: 0
      // };

      // DataHelpers.saveTweet(tweet, (err) => {
      //   if (err) {
      //     res.status(500).json({ error: err.message });
      //   } else {
      //     res.status(201).send();
      //   }
      // });

  tweetsRoutes.post("/:id/like", function(req, res) {
    const db = mongoUtil.getDb();
    const tweetID = req.params.id;
    let tweet = db.collection('tweets').findOne({ _id: new ObjectId(tweetID) });
    tweet.then(function(tweet) {
    db.collection('tweets').updateOne({ _id: new ObjectId(tweetID)}, { $set: { 'likes': tweet.likes + 1 } });
      const tweetLikes = tweet.likes + 1;
      res.status(200);
      res.send(JSON.stringify(tweetLikes));
    });
  });

  return tweetsRoutes;

}
