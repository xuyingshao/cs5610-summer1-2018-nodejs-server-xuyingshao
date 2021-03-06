var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://heroku_v4p27205:ms106fih028gngama9v3dj48pm@ds263520.mlab.com:63520/heroku_v4p27205');


var app = express();

// app.set('view engine', 'ejs');    // FIXME, deploy config

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Origin", "https://course-manager-angular-jeanne.herokuapp.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

var session = require('express-session');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'any string',
  cookie: {
    maxAge: 1800 * 1000,
  }
}));

app.get('/api/session/set/:name/:value', setSession);
app.get('/api/session/get/:name', getSession);
app.get('/api/session/get', getSessionAll);
app.get('/api/session/reset', resetSession);

function setSession(req, res) {
  var name = req.params['name'];
  var value = req.params['value'];

  req.session[name] = value;
  res.json(value);
}

function getSession(req, res) {
  var name = req.params['name'];
  var value = req.session[name];
  if (value === undefined) {
    res.sendStatus(404);
  } else {
    res.json(value);
  }
}

function getSessionAll(req, res) {
  res.json(req.session);
}

function resetSession(req, res) {
  req.session.destroy();
  res.sendStatus(200);
}

require('./services/user.service.server')(app);
require('./services/section.service.server')(app);
require('./services/enrollment.service.server')(app);

app.listen(process.env.PORT || 4000);    // port