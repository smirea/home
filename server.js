
require('colors');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const textRoutes = require('./routes/text');
const varRoutes = require('./routes/var');
const logRoutes = require('./routes/log');
const logger = require('./utils/logger');

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
app.use('/log', logRoutes());

server.listen(process.env.PORT || 1271, error => {
    if (error) throw error;
    logger.info('Listening on: %s'.bold, server.address().port.toString().green);
});
