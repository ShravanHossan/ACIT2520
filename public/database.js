const MongoClient = require('mongodb').MongoClient;
const express = require("express");
//const mongoose = require("mongoose");
const bodyParser = require('body-parser');

var utils = require('./utils');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Get a single entry password using website
app.get('/getWebsite', function(request, response) {

    var email = request.body.email;
    var websites = request.body.websites;
    // console.log(request.body.email);
    // console.log(request.body.websites);
    var db = utils.getDb();
    db.collection('accounts').find( {$and: [ {email: email}, {websites: websites} ] } ).toArray(function(err, result) {
        if (err) throw err;
        response.send(result)
    });

});


//Delete a password using the associated website
app.delete('/delWebsite', function(request, response) {

    var website = request.body.website;

    var db = utils.getDb();
    db.collection('accounts').deleteOne({website: website}, function(err, result) {
    }, (err, result) => {
        if (err) {
            response.send('Unable to delete account')
        }
        response.send(JSON.stringify(result.ops, undefined, 2))
    });
});


//Get all passwords associated with an email
app.get('/getEmail', function(request, response) {

    var email = request.body.email;

    var db = utils.getDb();
    db.collection('accounts').find({email: email}).toArray(function(err, result) {
        if (err) throw err;
        response.send(result)
    });

});

///Delete all passwords and websites associated with an email
app.delete('/delEmail', function(request,response) {

    var email = request.body.email;

    var db = utils.getDb();
    db.collection('accounts').deleteMany({email: email}, function(err, result) {
    }, (err, result) => {
        if (err) {
            response.send('Unable to delete account')
        }
        response.send(JSON.stringify(result.ops, undefined, 2))
    });
});

//Add an email, website, and password to the database
app.post('/addAccount', function(request, response) {

    var account = {
        email: request.body.email,
        website: request.body.website,
        password: request.body.password
    };


        // email: request.body.email,
        // pairs:[{
        //     websites: request.body.websites,
        //     passwords: request.body.passwords
        // }]


    var db = utils.getDb();
    db.collection('accounts').insertOne(account, function(err, result) {
    }, (err, result) => {
        if (err) {
            response.send('Unable to insert account');
        }
        response.send(JSON.stringify(result.ops, undefined, 2))
    });

});

MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
    if (err) {
        return console.log('Unable to connect to DB');

    }
    console.log('Successfully connected to MongoDB server');
    database.close()
});

app.listen(8080, () => {
    console.log('Server is up on the port 8080');
    utils.init();

});