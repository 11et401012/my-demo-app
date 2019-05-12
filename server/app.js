require.main.a = "asdasd";
var bodyParser = require('body-parser');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/controller/users');
var app = express();
const fileUpload = require('express-fileupload');
const cors = require("cors");

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

var mysql = require('mysql');
var myConnection  = require('express-myconnection');

var dbOptions = {
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'node_crud'
};

//app.use(myConnection(mysql, dbOptions, 'pool'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

//Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = require('./middlewares/dbConn');
app.use(db);

var myLogger = require('./middlewares/token');
app.use(myLogger);

app.use(cors({ origin: true }));
//main.use(cors({ origin: true }));

app.use(function(req, res, next) {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Expose-Headers", "*");
	res.set("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin");
//	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, test');
	console.log(req.headers);
//
    next()
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
