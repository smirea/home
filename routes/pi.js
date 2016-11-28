

const {exec} = require('child_process');
const express = require('express');

const {getVar} = require('../utils/var');
const logger = require('../utils/logger');

module.exports = () => {
    const app = express.Router();

    app.post('/', (req, res) => {
        const ip = getVar('pi-ip').value;
        const cmd = `curl -s -XPOST ${ip}:8080${req.body}`;
        logger.log('[pi]', cmd);
        exec(cmd, {stdio: [0,1,2]}, (error, stdout, stderr) => {
            if (error) return res.sendError(error);
            console.log(stdout);
            res.json({success: true});
        });
    });

    return app;
}
