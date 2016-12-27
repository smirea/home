
import React, {PureComponent, PropTypes} from 'react';
import Lights from './Lights';

export default class App extends PureComponent {

    state = {
        error: null,
    };

    errorHandler = error => {
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
        </div>
        );
    }

}

