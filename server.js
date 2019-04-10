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
const cookieParser = require('cookie-parser');




const port = process.env.PORT || 8080;

var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'very safe',
    resave: true,
    saveUninitialized: false,
}));

app.use((request, response, next) => {
    var time = new Date().toString();
    // console.log(`${time}: ${request.method} ${request.url}`);
    var log = `${time}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to log message');
        }
    });
    next();

});

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

app.get('/find', (request, response) => {
    response.render('findpassword.hbs', {
        title: 'Find Password'
    });
});

app.get('/findall', (request, response) => {
    response.render('findallpasswords.hbs', {
        title: 'Find All Passwords'
    });
});

app.get('/delete', (request, response) => {
    response.render('deletepassword.hbs', {
        title: 'Delete a Password'
    });
});

app.get('/deleteall', (request, response) => {
    response.render('deleteallpasswords.hbs', {
        title: 'Delete All Passwords'
    });
});




app.get('/manage', (request, response) => {

	response.render('manager.hbs', {
		title: 'Password Manager',
        message: ''
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



// MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD


//Add an email, website, and password to the database
app.post('/addAccount', function(request, response) {
    // if (request.session.id != null){


    // }else
    //     var db = utils.getDb();
    //     db.collection('acc').find({_id: request.session.user}).toArray((err, email) => {
    //
    // });
    //


	var account = {
        email: request.session.email,
		website: request.body.website,
		password: request.body.password
	};
    var db = utils.getDb();
	db.collection('accounts').insertOne(account, function (err, result) {
		if (err) {
			response.send('Unable to insert account');
		}
		response.send(JSON.stringify(result.ops, undefined, 2))
        // response.redirect("/manage/added")

		// response.send("Password Added Successfully.")
		// response.render('manager.hbs', {
		// 	title: 'Manager',
		// 	output: message
		// });
	});

});

//Get a single entry password using website
app.get('/getWebsite', function(request, response) {

    var email = request.session.email;
    var websites = request.body.websites;

    var db = utils.getDb();
    db.collection('accounts').find({ $and: [{email: email}, {websites: websites}] }).toArray(function(err, result) {
        if (err) throw err;
        response.send(result)
    });

});

//Get all passwords associated with an email
app.get('/getEmail', function(request, response) {

    var email = request.session.email;

    var db = utils.getDb();
    db.collection('accounts').find({email: email}).toArray(function(err, result) {
        if (err) throw err;
        response.send(result)
    });

});

//Delete a password using the associated website
app.post('/delWebsite', function(request, response) {

    var email = request.session.email;
    var websites = request.body.websites;

    var db = utils.getDb();
    db.collection('accounts').deleteOne({ $and: [{email: email}, {websites: websites}] }, function(err, result) {
        if (err) throw err;
        response.send(result)
    });

});

///Delete all passwords and websites associated with an email
app.post('/delEmail', function(request,response) {

    var email = request.session.email;

    var db = utils.getDb();
    db.collection('accounts').deleteMany({email: email}, function(err, result) {
    }, (err, result) => {
        if (err) {
            response.send('Unable to delete')
        }
        response.send(JSON.stringify(result.ops, undefined, 2))
    });
});


// MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD MANAGE PASSWORD

app.post('/breach', urlencodedParser, (request, response) => {
	breach.passwords_breach_lookup(request.body.password).then((message) => {
		response.render('breach.hbs', {
			title: 'Breach',
			output: message
		});

		app.get('/breach', (request, response) => {
			response.render('breach.hbs', {
				title: 'Breach',
			});
		});
	}).catch((error) => {
		response.render('breach.hbs', {
			title: 'Breach',
			output: error
		});
	});
});


app.post('/manage', urlencodedParser, (request, response) => {
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
    db.collection('users').find({_id: req.body.email}).toArray((err, result) => {
        if (err) {
            res.send(err)
        }
        try {
            if (bcrypt.compareSync(req.body.password, (result[0].hash))) {

                req.session.email = req.body.email;
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

app.get('/newUser', function(request, response) {
	response.render('sign-up.hbs', {
		title: 'Sign up'
	});
});

app.post('/newUser', function (req, res) {
    var db = utils.getDb();

    db.collection('users').insertOne({
        _id: req.body.email,
        hash: bcrypt.hashSync(req.body.password, 10)
    }, (err, result) => {
        if (err) {
            res.render("sign-up.hbs", {
                error: "User already exists"
            })
        }
        else

            res.redirect('/login')

    })
});

app.get('/sign-out', (req, res) => {
    req.session.destroy(function (err) {

        try {
            console.log(req.session.email)
        }catch(e){
            let time = new Date().toString();
            let log = `${time}: ${err} ${req.url}`;
            fs.appendFile('server.log', log + '\n', (error) => {
                if (error) {
                    console.log('Unable to log message');
                }})}

        finally {
            res.redirect('/');
        }

})});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});


