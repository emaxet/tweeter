"use strict";
/*eslint camelcase: 0*/

const userHelper    = require("../lib/util/user-helper");
const express       = require('express');
const mongoUtil     = require("../lib/util/mongo-connection");
const ObjectId      = require('mongodb').ObjectID;

const tweetsRoutes  = express.Router();

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
        const tweet = {
          user: userDoc[0],
          content: {
            text: req.body.text
          },
          created_at: Date.now(),
          created_by: userDoc[0].userID,
          likes: 0,
          liked: []
        };
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

  tweetsRoutes.post("/:id/like", function(req, res) {

    if (req.session.user_id) {

      const db = mongoUtil.getDb();
      const tweetID = req.params.id;
      let tweet = db.collection('tweets').findOne({ _id: new ObjectId(tweetID) });
      tweet.then(function(tweet) {

        if (tweet.created_by === req.session.user_id) {
          res.status(401);
          res.send("You can't like your own tweets!");
        } else {

          if (tweet.liked.indexOf(req.session.user_id) > -1) {
            db.collection('tweets').update({ _id: new ObjectId(tweetID)}, { $pull: { 'liked': req.session.user_id }, $set: { 'likes': tweet.likes -  1 } });
            const tweetLikes = tweet.likes - 1;
            res.status(200);
            res.send( JSON.stringify(tweetLikes) );
          } else {
            db.collection('tweets').update({ _id: new ObjectId(tweetID)}, { $push: { 'liked': req.session.user_id }, $set: { 'likes': tweet.likes + 1 } });
            const tweetLikes = tweet.likes + 1;
            res.status(200);
            res.send(JSON.stringify(tweetLikes));
          }
        }
      });

    } else {
      res.status(401);
      res.send("You aren't authorized to perform this action");
    }
  });

  return tweetsRoutes;

};
