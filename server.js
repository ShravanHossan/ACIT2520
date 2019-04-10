const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const utils = require('./public/utils');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const breach = require('./public/breach.js');
const manager = require('./public/manager.js');

const port = process.env.PORT || 8080;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

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

app.get('/manage', (request, response) => {
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

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});