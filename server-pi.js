
require('colors');

const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const DreamScreen = require('dreamscreen');

process.env.LOG_FILE = path.join(__dirname, 'log-pi.log');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

let ds = null;

const init = () => {
    app.use(bodyParser.text());
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.sendError = (error, status=400) => {
            res.setStatus(status);
            res.json({error})
        };
        next();
    });

    app.post('/DreamScreen/:method/:value', (req, res) => {
        console.log('here', req.params)
        ds[req.params.method](req.params.value)
        .then(result => res.json({success: true, result}))
        .catch(res.sendError);
    });

    app.use((err, req, res, next) => res.sendError(err));

    server.listen(process.env.PORT || 8080, error => {
        if (error) throw error;
        logger.info('Listening on: %s'.bold, server.address().port.toString().green);
    });
}

const initDreamScreen = () =>
    DreamScreen.getInstance({debug: true, discoverByName: true})
    .then(instance => {
        ds = instance;
        logger.info('[DreamScreen] connected');
        ds.on('disconnect', () => logger.warn('[DreamScreen] disconnected'));
    });

Promise.all([
    initDreamScreen(),
])
.then(init)
.catch(ex => {
    logger.error(ex.stack || ex);
    process.exit(1);
})
