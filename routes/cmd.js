
const express = require('express');

const {sendHook} = require('../utils/utils');
const logger = require('../utils/logger');

module.exports = () => {
    const app = express.Router();

    app.post('/', (req, res) => {
        const hooks = req.body.split(/[,;\n]/).map(str => str.trim())
        logger.log('[cmd]'.cyan, hooks);
        Promise.all(hooks.map(sendHook))
        .then(() => res.json({success: false}))
        .catch(res.sendError);
    });

    return app;
}
