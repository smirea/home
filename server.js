
require('colors');

// On heroku, use its proprietary env config
if (!process.env.IS_HEROKU) {
    require('dotenv').config();
}

const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const textRoutes = require('./routes/text');
const varRoutes = require('./routes/var');
const logRoutes = require('./routes/log');
const piRoutes = require('./routes/pi');
const cmdRoutes = require('./routes/cmd');
const lightRoutes = require('./routes/light');
const logger = require('./utils/logger');

const init = app => {
    app.use(bodyParser.text());
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.sendError = (error, status=400) => {
            res.status(status);
            res.json({error})
        };
        next();
    });

    app.use('/text', textRoutes());
    app.use('/var', varRoutes());
    app.use('/log', logRoutes());
    app.use('/pi', piRoutes());
    app.use('/cmd', cmdRoutes());
    app.use('/light', lightRoutes())
}

module.exports = init;

if (!module.parent) {
    const app = express();
    const server = http.createServer(app);

    init(app);
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'src' ,'index.html'));
    })
    app.use('/', express.static('build'));

    server.listen(process.env.PORT || 1271, error => {
        if (error) throw error;
        logger.info('Listening on: %s'.bold, server.address().port.toString().green);
    });
}
