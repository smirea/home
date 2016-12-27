
const express = require('express');

const logger = require('../utils/logger');
const LifX = require('../lib/lifx');

const livingRoom = LifX(process.env.LIFX_TOKEN, {
    duration: 1,
    selector: 'group:Living Room',
});

const promiseHandler = fn => (req, res) =>
    Promise.resolve()
    .then(() => fn(req, res))
    .then(result => res.json(result))
    .catch(error => {
        res.status(400);
        const msg = error.stack || error.message || error;
        console.error('[ERROR]', msg);
        res.json({error: '' + msg});
    });

module.exports = () => {
    const app = express.Router();

    app.get('/list', promiseHandler(() => livingRoom.list()));

    const stateHandler = state => promiseHandler((req, res) => {
        if (req.params.selector) {
            const bulb = LifX(process.env.LIFX_TOKEN, {
                duration: 1,
                selector: req.params.selector,
            });
            return bulb.state(state);
        }
        return livingRoom.state(state);
    });

    app.post('/on/:selector?', stateHandler({power: 'on'}));
    app.post('/off/:selector?', stateHandler({power: 'off'}));
    app.post('/states', promiseHandler((req) => livingRoom.states(req.body)));

    app.get('/scene/list', promiseHandler(() => livingRoom.listScenes()));
    app.post('/scene/off/:id', promiseHandler(req => livingRoom.sceneState(req.params.id, {power: 'off'})));
    app.post('/scene/on/:id', promiseHandler(req => livingRoom.sceneState(req.params.id, {power: 'on'})));

    return app;
};
