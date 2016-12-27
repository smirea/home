
const axios = require('axios');

const API = 'https://api.lifx.com/v1';

module.exports = (token, options) => new LifX(token, options);

/**
 * Selectors: https://api.developer.lifx.com/v1/docs/selectors
 */

class LifX {

    constructor (token, options) {
        this.token = token;
        this.options = Object.assign({
            duration: 1,
            selector: 'all',
        }, options);

        this.routes = {
            lights: 'lights/' + this.options.selector,
        };

        this.axios = axios.create({
            baseURL: API,
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
    }

    _request (method, route, options) {
        return this.axios[method](route, options)
            .then(result => result.data)
            .catch(result => Promise.reject(result.response || result));
    }

    list () { return this._request('get', this.routes.lights); }

    state (options) {
        options = Object.assign({
            power: 'on',
            duration: this.options.duration,
        }, options);

        return this._request('put', this.routes.lights + '/state', options);
    }

    states (states, defaults) {
        defaults = Object.assign({
            power: 'on',
            duration: this.options.duration,
        }, defaults);

        return this._request('put', 'lights/states', {
            states,
            defaults,
        });
    }

    listScenes () { return this._request('get', 'scenes'); }

    sceneState (sceneID, options) {
        // options = Object.assign({
        //     power: 'on',
        //     duration: this.options.duration,
        // });
        // state = options.power === 'off' ? 'deactivate' : 'activate';
        return this._request('put', `/scenes/scene_id:${sceneID}/activate`);
    }
}
