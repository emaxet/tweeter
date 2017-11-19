var MongoClient = require('mongodb').MongoClient;
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";

var _db;

module.exports = {

  connectToServer: function(callback) {
    MongoClient.connect(MONGODB_URI, (err, db) => {
      _db = db;
      return callback( err );
    });
  },
  getDb: function() {
    return _db;
  }
};