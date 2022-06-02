const mongoose = require('mongoose')
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars').create({ defaultLayout: 'layout', helpers: require('./helpers/handlebars') });
const path = require('path');
const bodyParse = require('body-parser');
const cookieParse = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const createErrors = require('http-errors');
const passport = require('./config/passport');

const app = express();
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

require('dotenv').config({ path: 'variables.env' });

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParse());
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
})

const router = require('./routes/index');
app.use('/', router());

app.use((req,res,next) => {
    next(createErrors(404,'No encontrado'))
})

app.use((error,req,res,next) => {
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status)
    res.render('error');
})

app.listen(process.env.PORT);