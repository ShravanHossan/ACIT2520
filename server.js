const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// const generator = require('./generator.js');

const port = process.env.PORT || 8080;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('links', (link) => {
	return link
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
});

app.get('/breach', (request, response) => {
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});