
require('colors');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const textRoutes = require('./routes/text');
const varRoutes = require('./routes/var');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.sendError = (error, status=400) => {
        res.setStatus(status);
        res.json({error})
    };
    next();
});

app.use('/text', textRoutes());
app.use('/var', varRoutes());

server.listen(process.env.PORT || 1271, error => {
    if (error) throw error;
    console.log('Listening on:', server.address().port);
});
