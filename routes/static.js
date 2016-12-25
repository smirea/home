
const fs = require('fs');
const path = require('path');
const express = require('express');

const static = {
    'axios.js': 'node_modules/axios/dist/axios.js',

    'react.js': 'node_modules/react/dist/react-with-addons.js',
    'react-dom.js': 'node_modules/react-dom/dist/react-dom.js',
    // 'redux.js': 'redux/dist/redux.js',
    // 'react-redux.js': 'react-redux/dist/react-redux.js',
};

module.exports = () => {
    const app = express.Router();
    const root = path.join(__dirname, '..');
    const cache = {};

    for (let key in static) {
        app.use('/' + key, express.static(path.join(root, static[key])));
    }

    app.get('*.js', (req, res) => {
        const file = req.url;
        const filePath = path.join(root, 'static', file);
        const content = '' + fs.readFileSync(filePath);

        if (cache[filePath] && cache[filePath].content === content) {
            return res.end(cache[filePath].code);
        }

        try {
            const {code} = require('babel-standalone').transform(content, {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: [
                    'transform-decorators-legacy',
                    'transform-react-display-name',
                ],
            });
            cache[filePath] = {content, code};
            res.end(code);
        } catch (ex) {
            const msg = ex.message.replace(/`/g, '\\`').replace();
            console.log(ex.stack || ex)
            res.end(`console.warn('[Babel] ${file}:', '\\n\\n', \`${msg}\`);`)
        }
    });

    app.use('/', express.static(path.join(root, 'static')));

    return app;
};
