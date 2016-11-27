
const express = require('express');

const {setVar, getVar} = require('../utils/var');
const logger = require('../utils/logger');

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
