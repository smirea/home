
const express = require('express');

const logger = require('../utils/logger');

const lifx = require('../lib/lifx')(process.env.LIFX_TOKEN, {
    duration: 1,
    selector: 'group:Living Room',
});

const promiseHandler = fn => (req, res) =>
    Promise.resolve()
    .then(() => fn(req, res))
    .then(result => res.json(result))
    .catch(error => res.json({error: error}));

module.exports = () => {
    const app = express.Router();

    app.get('/list', promiseHandler(() => lifx.list()));

    app.post('/on', promiseHandler(() => lifx.state({power: 'on'})));

    app.post('/off', promiseHandler(() => lifx.state({power: 'off'})));

    return app;
};
