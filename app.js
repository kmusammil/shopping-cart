var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { engine } = require('express-handlebars');  
var fileUpload = require('express-fileupload')
var db = require('./config/connection'); 
var session = require('express-session')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const { rmSync } = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', engine({extname:'hbs', runtimeOptions: {
  allowProtoPropertiesByDefault: true
}, defaultLayout:'layout', layoutsDir:__dirname+'/views/layout/', partialsDir: __dirname + '/views/partials/'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use(session({
    secret: 'key',
    resave: false, // Set to false to prevent resaving unchanged sessions
    saveUninitialized: true, // Set to true to save uninitialized sessions (default: true)
    cookie: { maxAge: 600000 } // Session duration
}));

db.connectToDatabase((err) => {
  if (err) {
    console.log('Connection error: ' + err);
  } else {
    console.log('Database connected successfully');
  }
});



app.use('/', userRouter);
app.use('/admin', adminRouter);

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
