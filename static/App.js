
const {PureComponent, PropTypes} = React;

class App extends PureComponent {

    state = {
        loading: false,
        lights: [],
        error: null,
    };

    componentWillMount () {
        this.fetchLights();
        setInterval(() => this.fetchLights(), 60 * 1000);

        // this.setState({
        //     lights: [
        //         {id: '1', power: 'on', connected: true, label: 'Test On'},
        //         {id: '2', power: 'off', connected: true, label: 'Test Off'},
        //         {id: '3', power: 'on', connected: true, label: 'Test On'},
        //         {id: '4', power: 'off', connected: true, label: 'Test Off'},
        //         {id: '5', power: 'off', connected: false, label: 'Test Not Connected'},
        //     ],
        // })
    }

    fetchLights () {
        this.setState({loading: true});

        return axios.get('/light/list').then(list =>
            this.setState({
                loading: false,
                lights: list.data,
            })
        )
        .catch(ex => {
            this.setState({loading: false});
            this.errorHandler(ex);
        })
    }

    updateLights (updates) {
        const {lights} = this.state;
        this.setState({
            lights: lights.map(obj => {
                const match = updates.find(item => item.id === obj.id);
                if (!match) return obj;
                return Object.assign({}, obj, match);
            }),
        });
    }

    errorHandler = (ex) => {
        console.warn(ex)
    }

    handleLightToggle = (id, power) => {
        axios.post('/light/' + power + '/id:' + id)
        .then(res => this.updateLights([{id, power}]))
        .catch(this.errorHandler);
    };

    render () {
        const {style, ...rest} = this.props;
        const {lights, error, loading} = this.state;

        return (
        <div {...rest} style={style}>
            {!error ? null : <div className='error'>{error}</div>}
            {!loading ? null : <div>'Loading...'</div>}
            <div className='lights'>
                {lights.map(obj => <Light key={obj.id} data={obj} toggle={this.handleLightToggle} />)}
            </div>
        </div>
        );
    }

}


class Light extends PureComponent {

    static propTypes = {
        toggle: PropTypes.func.isRequired,
        data: PropTypes.shape({
            id: PropTypes.string.isRequired,
            power: PropTypes.oneOf(['on', 'off']).isRequired,
            connected: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
        }).isRequired,
    };

    handleToggle = () => {
        const {data: {id, power}, toggle} = this.props;
        toggle(id, power === 'on' ? 'off' : 'on');
    }

    render () {
        const {data: {id, power, connected, label}, toggle, ...rest} = this.props;

        return (
        <div
            {...rest}
            className={`light ${connected ? `power-${power}` : 'not-connected'}`}
            onClick={this.handleToggle}
        >
            <div className="light-icon"></div>
            <div className="light-name">{label}</div>
        </div>
        );
    }

}
