const express = require('express');
const app = express();

app.use('/', (req, res) => {
    res.send('Server ok');
})

app.listen(3000);