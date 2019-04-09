const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const breach = require('./public/breach.js');
const utils = require('./public/utils.js');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const cookieSession = require('cookie-session');

const port = process.env.PORT || 8080;
var app = express();

app.use(session({secret: "very safe", cookie: {}}));
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.urlencoded({
    extended: true
}));

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('links', (link) => {
    return link
});

hbs.registerHelper('message', (text) => {
    return text;
});

app.use((request, response, next) => {
    setTimeout(() => {
        next();
    }, 1000);

});

app.get('/', (request, response) => {
    response.render('home.hbs', {
        title: 'Home'
    });
});

app.get('/generate', (request, response) => {
    response.render('generator.hbs', {
        title: 'Password Generator'
    });
});

app.get('/login', (request, response) => {
    response.render('login.hbs', {
        title: 'Login'
    });
});

app.get('/sign-up', (request, response) => {
    response.render('sign-up.hbs', {
        title: 'Sign up'
    });
});

app.get('/manage', (request, response) => {
    if (request.session.get('key', 'default') == null){
        response.redirect("/login");
    }
    else
        console.log('here we are')


});

app.get('/breach', (request, response) => {
    response.render('breach.hbs', {
        title: 'Breach'
    });
});

app.post('/breach', urlencodedParser, (request, response) => {
    breach.passwords_breach_lookup(request.body.password).then((message) => {
        response.render('breach.hbs', {
            title: 'Breach',
            output: message
        });
    }).catch((error) => {
        response.render('breach.hbs', {
            title: 'Breach',
            output: error
        });
    });
});
app.post('/login-entry', (req, res) => {
    let db = utils.getDb();
    // console.log(db);
    // console.log(req.body.email);
    db.collection('users').find({_id: req.body.email}).toArray((err, result) => {
        if (err) {
            res.send(err)
        }

        // res.send((result[0].hash));
        try {
            if (bcrypt.compareSync(req.body.password, (result[0].hash))) {
                console.log("good login");

                res.session.put('key', req.body.email);
                res.redirect('/manage');
            } else
                res.send("Password is not correct")
        } catch (e) {
            res.send("User doesn't exist")
        }

    })
});

app.post('/newUser', function (req, res) {
    var db = utils.getDb();

    db.collection('users').insertOne({
        _id: req.body.email,
        hash: bcrypt.hashSync(req.body.password, 10)
    }, (err, result) => {
        if (err) {
            res.send(err.errmsg)
        }
        res.send(result)
        // res.send(result.ops)
    })
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);

    MongoClient.connect("mongodb+srv://Spyder:r0PTfX3Z5lYsaLvs@cluster0-jogjo.gcp.mongodb.net/test?retryWrites=true", function (err, client) {
        if (err) {
            return console.log("Unable to connect to DB");
        }
        console.log('Successfully connected to MongoDB server');
        client.close();

    });
});


