const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Spyder:r0PTfX3Z5lYsaLvs@cluster0-jogjo.gcp.mongodb.net/test?retryWrites=true";

var _db = null;

module.exports.getDb = function() {
    return _db;
};

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    if (err)
        return err;

    _db = client.db('acit');
    console.log('Successfully connected to MongoDB server')
});


