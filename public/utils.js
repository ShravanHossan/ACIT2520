const MongoClient = require('mongodb').MongoClient;

var _db = null;

module.exports.getDb = function() {
    return _db;
};

module.exports.init = function(callback) {
    MongoClient.connect('mongodb://localhost:27017/test', function (err, client) {
        if (err) {
            return console.log('Unable to connect to DB');
        }
        _db = client.db('test');
        console.log('Successfully connected to MongoDB server')
    });
};

//
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://Spyder:<password>@cluster0-jogjo.gcp.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("accounts");
//     // perform actions on the collection object
//     client.close();
// });