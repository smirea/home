
const http = require('http');
const express = require('express');

const KEY = process.env.IFTT_MAKER_KEY;

const app = express();

const server = http.createServer(app);

server.listen(process.env.PORT || 1271, error => {
    if (error) throw error;
    console.log('Listening on:', server.address().port);
})
