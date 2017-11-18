"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const mongoUtil     = require("./lib/util/mongo-connection.js");
const cookieSession = require('cookie-session');
const userHelper    = require('./lib/util/user-helper.js');
var methodOverride  = require('method-override')

app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieSession({
  name: "session" ,
  keys: ['key1']
}));
app.use((req, res, next) => {
  app.locals.userID = (req.session.user_id) ? req.session.user_id : null;
  app.locals.nameTaken = false;
  app.locals.noMatch = false;
  next();
});


mongoUtil.connectToServer((err) => {

  if (err) throw err;

  const db = mongoUtil.getDb();

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  const DataHelpers = require("./lib/data-helpers.js")(db);

  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Register a new user

  app.put("/register", (req, res) => {

    db.collection('users').find( { name: req.body.username } ).toArray((err, userArray) => {
      if(userArray.length) {
        res.render("register", { nameTaken: true })
      } else {
        req.session.user_id = Math.floor(Math.random() * 1000000) + 1;
        let newUser  = {};
        const userInfo = {
          'name': req.body.username,
          'password': req.body.password,
          'userID': req.session.user_id
        }
        newUser = userHelper.generateRandomUser(userInfo);
        db.collection('users').insert(newUser);
        res.redirect("/");
        return;
      }
    });
  });

  // User login

  app.put("/login", (req, res) => {
     db.collection('users').find( { name: req.body.username } ).toArray((err, userArray) => {
      if(userArray.length) {
        if(userArray[0].name === req.body.username && userArray[0].password === req.body.password) {
          req.session.user_id = userArray[0].userID;
          res.redirect("/")
        } else {
          res.render("login", { noMatch : true});
        }
      } else {
        res.render("login", { noMatch : true });
      }
    });
  });

  app.delete("/logout", (req, res) => {
      req.session = null
      res.redirect("/");
  });

  app.use("/tweets", tweetsRoutes);


});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
