
require('colors');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const textRoutes = require('./routes/text');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use('/text', textRoutes());

server.listen(process.env.PORT || 1271, error => {
    if (error) throw error;
    console.log('Listening on:', server.address().port);
});
