const mongoose = require('mongoose')
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars').create({ defaultLayout: 'layout' });
const path = require('path');
const app = express();

require('dotenv').config({ path: 'variables.env' });

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

const router = require('./routes/index');
app.use('/', router());

app.listen(process.env.PORT);