
require('colors');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const commands = require('./commands');

const KEY = process.env.IFTT_MAKER_KEY;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.text());
app.use(bodyParser.json());

app.post('/google', (req, res) => {
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

const sendHook = hook => axios.post(`https://maker.ifttt.com/trigger/${hook}/with/key/${KEY}`);

server.listen(process.env.PORT || 1271, error => {
    if (error) throw error;
    console.log('Listening on:', server.address().port);
});
