
import React, {PureComponent, PropTypes} from 'react';

import Lights from './Lights';
import Power from './Power';

import './global.css';

export default class App extends PureComponent {

    state = {
        error: null,
    };

    componentWillMount () {
        // Periodically refresh
        let timeout = null;
        document.body.addEventListener('mousedown', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                window.location.reload();
            }, 3600 * 1000);
        })
    }

    errorHandler = error => {
        if (error === null) return this.setState({error: null});

        console.warn(error)
        const msg = !error ?
            'An unknown error occured' :
            error.response && error.response.data && error.response.data.error ? error.response.data.error :
            error instanceof Error ? error.stack || error.message || error :
            '' + error;
        this.setState({error: msg});
    }

    render () {
        const {error} = this.state;

        return (
        <div>
            {!error ? null : <div className='error'>{error}</div>}

            <Lights onError={this.errorHandler} />
            <Power onError={this.errorHandler} />
        </div>
        );
    }

}

