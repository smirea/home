
const express = require('express');

const {sendHook} = require('../utils/utils');
const commands = require('../utils/commands');

module.exports = () => {
    const app = express.Router();

    app.post('/', (req, res) => {
        const text = req.body;
        console.log('>>', text);
        for (let [reg, mappingList] of commands) {
            const match = text.match(reg);
            if (!match) continue;

            const hooks = mappingList.map(fn => fn(match.slice(1))).map(arr => arr.join('-'));

            console.log('   - execute'.cyan, hooks.map(str => str.bold).join(', '));
            return Promise.all(hooks.map(sendHook))
            .then(response => res.json({success: true, hooks}))
            .catch(ex => {
                res.json({success: false, error: ex});
                console.log('[ERROR]'.red, ex.stack || ex)
            });
            return;
        }
        res.json({success: false});
    });

    return app;
}
