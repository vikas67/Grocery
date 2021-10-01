var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const fs = require("fs");
const connectFlash = require('connect-flash');
require('dotenv').config();
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');
const compression = require('compression');



var clientRouter = require('./routes/client.routes');
var adminRouter = require('./routes/admin.routes');
var apiRouter = require('./routes/api.routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression())
app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const MongoStore = connectMongo(session);

/* Init Session */
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            // secure: true,
            httpOnly: true,
        },
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);


/* For Passport JS Authentication */
app.use(passport.initialize());
app.use(passport.session());
// require('./util/passport.auth');


/* Connect Flash */
app.use(connectFlash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

/*  Routers */
app.use('/', clientRouter);
app.use('/admin', adminRouter);
app.use('/app/api/v1', apiRouter);

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
  // res.render('error');
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
      error : true
    },
  })

});

module.exports = app;
