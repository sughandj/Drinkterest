var crypto = require('crypto');
var http = require('http');
var path = require('path');
var util = require('util');
var express = require('express');
var session = require('express-session');
var expressValidator = require('express-validator');
var app = express();
var bodyParser = require('body-parser');
var NedbStore = require('nedb-session-store')(session);

app.use(express.static(path.join(__dirname,'../client/build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(session({
  secret: 'topsecret',
  resave: true,
  saveUninitialized: true,
  store: new NedbStore({
    filename: './db/session.db'
  }),
}));

app.use(bodyParser.json());
app.use(expressValidator());

var Datastore = require('nedb');
var users = new Datastore({ filename: path.join(__dirname,'db', 'users.db'), autoload: true, timestampData : true});
var favorites = new Datastore({ filename: path.join(__dirname,'db', 'favorites.db'), autoload: true, timestampData : true});


// User constructor

var User = function(user) {
  var salt = crypto.randomBytes(16).toString('base64');
  var hash = crypto.createHmac('sha512', salt);
  hash.update(user.password);

  this.username = user.username;
  this.salt = salt;
  this.saltedHash = hash.digest('base64');
};


// Favorite constructor

var Favorite = function(data) {
  this.username = data.username;
  this.drink = data.drink;
};


// Security

app.use(function(req, res, next) {
  Object.keys(req.body).forEach(function(arg) {
    switch(arg){
      case 'username':
        req.sanitizeBody(arg).escape();
        req.sanitizeBody(arg).trim();
        req.checkBody(arg, 'Username cannot be empty').notEmpty();
        break;
      case 'password':
        req.sanitizeBody(arg).escape();
        req.sanitizeBody(arg).trim();
        req.checkBody(arg, 'Password cannot be empty').notEmpty();
        break;
      case 'drink':
        req.sanitizeBody(arg).escape();
        req.sanitizeBody(arg).trim();
        req.checkBody(arg, 'Invalid drink id').notEmpty().isInt();
        break;
    }
  });

  Object.keys(req.params).forEach(function(arg) {
    switch(arg){
      case 'drink':
        req.sanitizeParam(arg).escape();
        req.sanitizeParam(arg).trim();
        req.checkParam(arg, 'Invalid drink id').notEmpty().isInt();
        break;
    }
  });

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      return res
        .status(400)
        .send('Validation errors: ' + util.inspect(result.array().map(function(r) { return r.msg })));
    }
    else next();
  });
});


// Authenticate

var checkPassword = function(user, password) {
  var hash = crypto.createHmac('sha512', user.salt);
  hash.update(password);
  var value = hash.digest('base64');
  return (user.saltedHash === value);
};

var checkUserAuth = function(req, res, next) {
  if (!req.session.user) return res.status(403).end("Forbidden");
  else next();
};

app.post('/api/signin/', function (req, res, next) {
  users.findOne({ username: req.body.username }, function(err, user) {
    if (err) return res.status(500).end(err);
    if (!user || !checkPassword(user, req.body.password)) return res.status(401).end("Incorrect username and password combination");
    req.session.user = user;
    req.session.save();
    delete user.salt;
    delete user.saltedHash;
    return res.json(user);
  });
});

app.delete('/api/signout/', checkUserAuth, function (req, res, next) {
  req.session.destroy(function(err) {
    if (err) return res.status(500).end(err);
    return res.end();
  });
});


// Get

app.get('/api/authorized', function (req, res, next) {
  return (req.session.user ? res.json(req.session.user.username) : res.json(false));
});

app.get('/api/favorites', checkUserAuth, function (req, res, next) {
  favorites.find({ username: req.session.user.username }).exec(function(err, favoritesList) { 
    if (err) return res.status(500).end(err);
    return res.json(favoritesList.map(function(f) { return f.drink }));
  });
});


// Create

app.post('/api/user/', function (req, res, next) {
  var data = new User(req.body);
  users.findOne({ username: req.body.username }, function(err, user) {
    if (err) return res.status(500).end(err);
    if (user) return res.status(409).end("Username " + req.body.username + " already exists");
    users.insert(data, function (err, user) {
      if (err) return res.status(500).end(err);
      delete user.salt;
      delete user.saltedHash;
      return res.json(user);
    });
  });
});

app.post('/api/favorite/', checkUserAuth, function (req, res, next) {
  req.body.username = req.session.user.username;
  var data = new Favorite(req.body);
  favorites.insert(data, function (err, favorite) {
    if (err) return res.status(500).end(err);
    return res.json(favorite);
  });
});


// Delete

app.delete('/api/favorite/:id/', checkUserAuth, function (req, res, next) {
  favorites.remove({ username: req.session.user.username, drink: req.params.id }, { multi: true }, function(err, num) {
    if (err) return res.status(500).end(err);
    return res.end();
  });
});


// LCBO API

app.get('/lcboapi/products*', function (req, res, next) {
  var options = {
    hostname: 'lcboapi.com',
    path: req._parsedOriginalUrl.pathname.replace("/lcboapi", "") + req._parsedOriginalUrl.search,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Token MDpiYWYyMDE3Ni1kN2M0LTExZTctOGZkNi0zN2FjYjI5ZDM3MmM6MGtVd2tKTXVmdjlOYzlPS2hBNUtkaDcwb3NZcmoxbTROOFB5'
    }
  };

  var lcboreq = http.request(options, function (lcbores) {
    var body = '';
    lcbores.setEncoding('utf8');
    lcbores.on('data', function (chunk) {
      body += chunk;
    });
    lcbores.on('end', () => {
      return res.json(JSON.parse(body));
    });
  });

  lcboreq.on('error', function (err) {
    return res.status(500).end(err);
  });

  lcboreq.end();
});


// Listen

app.listen(process.env.PORT || 5000, function () {
  console.log('App running');
});