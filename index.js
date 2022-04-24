const express = require('express');
const path = require('path');
const app = express();

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

const router = require('./routes/index');
app.use('/', router());

app.listen(3000);