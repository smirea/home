
const DreamScreen = require('dreamscreen');

const [, , method, value] = process.argv;

DreamScreen.getInstance({debug: true, discoverByName: true})
    .then(instance => {
        ds = instance;
        console.info('[DreamScreen] connected');
        ds.on('disconnect', () => console.warn('[DreamScreen] disconnected'));
        return ds;
    })
    .then(ds => ds[method](value))
    .then(() => 0)
    .catch(ex => console.error(ex.stack || ex) || 1)
    .then(process.exit);
