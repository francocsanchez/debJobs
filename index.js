const mongoose = require('mongoose')
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars').create({ defaultLayout: 'layout' });
const path = require('path');
const cookieParse = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

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

const router = require('./routes/index');
app.use('/', router());

app.listen(process.env.PORT);