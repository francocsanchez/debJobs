const express = require('express');
const app = express();

const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')

const router = require('./routes/index')
app.use('/', router())

app.listen(3000);