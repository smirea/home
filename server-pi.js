
require('colors');

const http = require('http');
const path = require('path');
const {exec} = require('child_process');

const express = require('express');
const bodyParser = require('body-parser');

process.env.LOG_FILE = path.join(__dirname, 'log-pi.log');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

let ds = null;

const init = () => {
    app.use((req, res, next) => {
        res.sendError = (error, status=400) => {
            res.status(status);
            res.json({error: error && error.message || error});
        };
        next();
    });

    app.post('/DreamScreen/:method/:value', (req, res) => {
        const {method, value} = req.params;
        exec(`node ds-manager "${method}" "${value}"`, {stdio: [0,1,2]}, (error, stdout, stderr) => {
            if (error) return res.sendError(error);
            console.log(stdout);
            res.json({success: true});
        });
    });

    app.use((err, req, res, next) => res.sendError(err));

    server.listen(process.env.PORT || 8080, error => {
        if (error) throw error;
        logger.info('Listening on: %s'.bold, server.address().port.toString().green);
    });
}

Promise.resolve()
.then(init)
.catch(ex => {
    console.error(ex.stack || ex);
    process.exit(1);
})
