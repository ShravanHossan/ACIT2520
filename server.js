const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const utils = require('./public/utils');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const breach = require('./public/breach.js');
const manager = require('./public/manager.js');
const session = require('express-session');




const port = process.env.PORT || 8080;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'very safe',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
var urlencodedParser = bodyParser.urlencoded({extended: false});


// start session for an http request - response
// this will define a session property to the request object


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
    if (request.session.id != null){
        console.log("Session works")
    }
	response.render('manager.hbs', {
		title: 'Password Manager'
	});
});

// app.post('/manage', urlencodedParser, (request, response) => {
// 	manager.add_password(request.body.username, request.body.url, request.body.password).then((message) => {
// 		rsponse.render('manager.hbs', {
// 			title: 'Password Manager',
// 			output: message
// 		});
// 	});
// });

//Add an email, website, and password to the database
app.post('/addAccount', function(request, response) {

	var account = {
		// email: request.body.email,
		website: request.body.website,
		password: request.body.password
	};

	var db = utils.getDb();
	db.collection('accounts').insertOne(account, function (err, result) {
		if (err) {
			response.send('Unable to insert account');
		}
		response.send(JSON.stringify(result.ops, undefined, 2))
		// response.send("Password Added Successfully.")
		// response.render('manager.hbs', {
		// 	title: 'Manager',
		// 	output: message
		// });
	});

});

app.post('/breach', urlencodedParser, (request, response) => {
	breach.passwords_breach_lookup(request.body.password).then((message) => {
		response.render('breach.hbs', {

		});

		app.get('/breach', (request, response) => {
			response.render('breach.hbs', {
				title: 'Breach',
				output: message
			});
		});
	}).catch((error) => {
		response.render('breach.hbs', {
			title: 'Breach',
			output: error
		});
	});
});

MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
	if (err) {
		return console.log('Unable to connect to DB');

	}
	database.close()
});

app.post('/manage', urlencodedParser, (request, response) => {
	if (request.session.id != null){
	    console.log("Session works")
    }

    manager.add_password(request.body.username, request.body.url, request.body.password).then((message) => {
		response.render('manager.hbs', {
			title: 'Password Manager',
			output: message
		});
	});
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
        try {
            if (bcrypt.compareSync(req.body.password, (result[0].hash))) {
                console.log("good login");

                req.session.user = req.body.email;
                res.redirect('/manage');
            } else
                res.send("Password is not correct")
        } catch (e) {
            res.render('login.hbs', {
                title: 'login ',
                error: "User does not exist"})
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
            res.render("sign-up.hbs", {
                error: err
            })
        }
        else

            res.redirect('/login')

    })
});

app.post('/sign-out', (req, res) => {
    req.session.destroy()
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);

    // MongoClient.connect("mongodb+srv://Spyder:r0PTfX3Z5lYsaLvs@cluster0-jogjo.gcp.mongodb.net/test?retryWrites=true", function (err, client) {
    //     if (err) {
    //         return console.log("Unable to connect to DB");
    //     }
    //     console.log('Successfully connected to MongoDB server');
    //     client.close();
    //
    // });
});


