var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
import * as sch from './schemas/schemas';
const Schema = mongoose.Schema;

const employeeScheme = new Schema({
  name: {
    type: String,
    required: true,
    minlength:6,
    maxlength:30
  },
  gender:  {
    type: String,
    required: true,
    minlength:1,
    maxlength:1
  },
  contactInfo : {
    address: {
      type: {
        city: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 15
        },
        street: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 20
        },
        houseN: {
          type: Number,
          required: true,
          min: 1,
          max: 9999
        },
        addN: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 3
        },
      },
      required: true
    },
    email : {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20
    }
  },
  addDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true,
    min: 500,
    max: 5000000
  },
  position: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15
  }
});

// подключение
mongoose.connect("mongodb://localhost:27017/db", { useNewUrlParser: true });

const Employee = mongoose.model("Employee", sch.schemas.employeeSchema);
const employee = new Employee({
  name : "Olha Dou",
  gender : "m",
  contactInfo : {
    address : {
      city : "Kyiv",
      street : "19 street",
      houseN : 44,
      addN : "C"
    },
    email : "jonhn@dou.com"
  },
  addDate : new Date(),
  salary : 300,
  position : "human resource"
});

employee.save(function(err){
  mongoose.disconnect();  // отключение от базы данных

  if(err) return console.log(err);
  console.log("Сохранен объект", employee);
});

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
