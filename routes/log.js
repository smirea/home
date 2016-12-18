
const fs = require('fs');
const express = require('express');
const stripAnsi = require('strip-ansi');
const logger = require('../utils/logger');

module.exports = () => {
    const app = express.Router();

    app.get('/', (req, res) => {
        res.set('Content-Type', 'text/plain');
        res.send(
            stripAnsi(
                '' + fs.readFileSync(logger.LOG_FILE)
            )
            .split('\n')
            .reverse()
            .join('\n')
        );
    });

    app.post('/', (req, res) => {
        logger.info(req.body);
        res.json({success: true});
    });

    return app;
};
