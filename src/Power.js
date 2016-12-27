
import axios from 'axios';
import React, {PureComponent, PropTypes} from 'react';
import {Icon} from 'react-fa';

import './Power.css';

export default class Power extends PureComponent {

    static propTypes = {
        onError: PropTypes.func.isRequired,
    };

    state = {
        power: {
            'heater-lamp': 'off',
            'heater-window': 'off',
        },
    };

    toggle (prefix, power) {
        this.setState({
            power: {
                ...this.state.power,
                [prefix]: power,
            },
        })
        axios({
            method: 'post',
            url: '/cmd',
            data: `${prefix}-${power}`,
            headers: {
                'Content-Type': 'text/plain',
            },
        })
        .catch(this.props.onError);
    }

    render () {
        const {onError, ...rest} = this.props;

        return (
        <div>
            <div className='title'>Power Control</div>

            <div {...rest} className='row'>
                <PowerIcon
                    name='Window Heater'
                    onClick={val => this.toggle('heater-window', val)}
                    power={this.state.power['heater-window']}
                />
                <PowerIcon
                    name='Lamp Heater'
                    power={this.state.power['heater-lamp']}
                    onClick={val => this.toggle('heater-lamp', val)}
                />
            </div>
        </div>
        );
    }
}

const PowerIcon = ({name, power, onClick, ...rest}) =>
    <div
        {...rest}
        onClick={() => onClick(power === 'off' ? 'on' : 'off')}
        className={`button power-${power}`}
    >
        <Icon size='5x' name='power-off' className='button-icon' />
        <div className='button-name'>{name}</div>
    </div>
