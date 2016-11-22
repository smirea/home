
const fs = require('fs');
const express = require('express');
const stripAnsi = require('strip-ansi');
const {LOG_FILE} = require('../utils/logger');

module.exports = () => {
    const app = express.Router();

    app.get('/', (req, res) => {
        res.set('Content-Type', 'text/plain');
        res.send(stripAnsi('' + fs.readFileSync(LOG_FILE)));
    });

    return app;
};
