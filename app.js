var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs');
const passport = require('passport');
const session = require('express-session')
const flash = require('express-flash')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var piratesRouter = require('./routes/game');

var app = express();
const usersService = require('./usersService.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('greaterThan', function (v1, v2, options) {
    'use strict';
    if (v1>v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
hbs.localsAsTemplateData(app)


/**
 * Setup passport
 */
passport.use('basic', {
    authenticate: function(req) {
        console.log('Authenticating...');
        usersService.authenticate(req.body.username, req.body.password, (err, user, info) => {
            if(err) return this.error(err);
            if(!user) return this.fail({message: info});
            this.success(user) // => redirect + gravar no Cookie o user
        })
    }
});
passport.serializeUser((user, cb) => {
    cb(null, user.username)
});

passport.deserializeUser((username, cb) => {
    usersService.find(username, cb)
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session()) // Obtem da sessão user id -> deserialize(id) -> user -> req.user
app.use(flash())
app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pirates', piratesRouter);
app.post('/pirates/login', passport.authenticate('basic', {
    successRedirect: 'back',
    failureRedirect: 'back',
    failureFlash: true
}))
app.post('/pirates/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

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
