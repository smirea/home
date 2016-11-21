
const fs = require('fs');
const path = require('path');
const express = require('express');

const STORAGE_FILE = path.join(__dirname, '..', 'variables.json');

module.exports = () => {
    const app = express.Router();

    app.post('/set/:name', (req, res) => {
        if (!req.body || !('value' in req.body)) {
            return res.sendError('Expected signature: {value: ...}');
        }
        setVar(req.params.name, req.body.value);
        res.json({success: true});
    });

    app.get('/get/:name', (req, res) => {
        res.json({
            [req.params.name]: getVar(req.params.name),
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
