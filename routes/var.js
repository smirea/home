
const fs = require('fs');
const path = require('path');
const express = require('express');

const logger = require('../utils/logger');

const STORAGE_FILE = path.join(__dirname, '..', 'variables.json');

module.exports = () => {
    const app = express.Router();

    app.post('/set/:name', (req, res) => {
        if (!req.body || !('value' in req.body)) {
            return res.sendError('Expected signature: {value: ...}');
        }
        logger.log('[VAR]'.yellow, req.params.name.cyan, req.body.value);
        setVar(req.params.name, req.body.value);
        res.json({success: true});
    });

    app.get('/get/:name', (req, res) => {
        const {name} = req.params;
        res.json({
            [name]: getVar(name),
        });
    })

    return app;
};

if (!fs.existsSync(STORAGE_FILE)) fs.writeFileSync(STORAGE_FILE, '{}');

const setVar = (key, value) => {
    const data = Object.assign({}, getAllVars(), {
        [key]: {
            value,
            date: (new Date()).toISOString(),
        },
    });
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 4));
};

const getVar = key => getAllVars()[key];

const getAllVars = () => JSON.parse(fs.readFileSync(STORAGE_FILE));
