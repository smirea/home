
const {PureComponent, PropTypes} = React;

const ExtraPropTypes = {
    light: () =>
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            power: PropTypes.oneOf(['on', 'off']).isRequired,
            connected: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
        }),
};

class Lights extends PureComponent {

    static propTypes = {
        onError: PropTypes.func.isRequired,
    };

    state = {
        loading: false,
        lights: [],
        scenes: [],
    };

    componentWillMount () {
        this.fetch();
        setInterval(() => this.fetch(), 60 * 1000);
    }

    fetch () {
        this.setState({loading: true});

        return Promise.all([
            axios.get('/light/scene/list'),
            axios.get('/light/list'),
        ])
        .then(([scenes, lights]) => {
            this.setState({
                loading: false,
                lights: lights.data,
                scenes: scenes.data,
            })
        })
        .catch(ex => {
            this.setState({loading: false});
            this.props.onError(ex);
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

    handleLightToggle = (id, power) => {
        axios.post('/light/' + power + '/id:' + id)
        .then(res => this.updateLights([{id, power}]))
        .catch(this.props.onError);
    };

    handleSceneToggle = (id, power) => {
        const {lights} = this.state;
        const nextLightsState = lights.map(obj => ({id: obj.id, power}));

        const promise = power === 'on' ?
            axios.post('/light/scene/on/' + id) :
            axios.post('/light/states', nextLightsState.map(obj => ({selector: 'id:' + obj.id, power: obj.power})));

        promise
            .then(res => {
                const {lights} = this.state;
                this.updateLights(nextLightsState);
            })
            .catch(this.props.onError);
    };

    render () {
        const {className, ...rest} = this.props;
        const {scenes, lights, error, loading} = this.state;

        return (
        <div {...rest} className={`lights ${className || ''}`}>
            {!loading ? null : <div>Loading...</div>}

            <div className='row'>
                {scenes
                    // Only show the Living Room scene for now
                    .filter(obj => obj.uuid === 'd6c8fdee-4374-48b0-8e18-0f1b1b95a566')
                    .map(obj =>
                        <Scene key={obj.uuid} data={obj} lights={lights} toggle={this.handleSceneToggle} />
                    )
                }
            </div>

            <div className='row'>
                {lights.map(obj => <Light key={obj.id} data={obj} toggle={this.handleLightToggle} />)}
            </div>
        </div>
        );
    }

}

class Scene extends PureComponent {
    static propTypes = {
        toggle: PropTypes.func.isRequired,

        data: PropTypes.shape({
            uuid: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            states: PropTypes.arrayOf(PropTypes.shape({
                selector: PropTypes.string.isRequired,
                brightness: PropTypes.number.isRequired,
                power: PropTypes.oneOf(['on', 'off']).isRequired,
                color: PropTypes.shape({
                    hue: PropTypes.number.isRequired,
                    kelvin: PropTypes.number.isRequired,
                    saturation: PropTypes.number.isRequired,
                }).isRequired,
            })).isRequired,
        }).isRequired,

        lights: PropTypes.arrayOf(ExtraPropTypes.light()).isRequired,
    };

    getPower () { return this.props.lights.some(obj => obj.power === 'off') ? 'off' : 'on'; }

    handleToggle = () => {
        const {data: {uuid, power}, toggle} = this.props;
        toggle(uuid, this.getPower() === 'on' ? 'off' : 'on');
    }

    render () {
        const {lights, data: {name, uuid, states}, toggle, ...rest} = this.props;
        const {brightness, color: {hue, saturation, kelvin}} = states[0];

        return (
        <div className='scene'>
            <Light
                iconStyle={{background: `hsl(${hue}, ${saturation * 100 + '%'}, ${brightness * 100 + '%'})`}}
                toggle={this.handleToggle}
                data={{
                    id: uuid,
                    label: name,
                    connected: true,
                    power: this.getPower(),
                }}
            />
        </div>
        );
    }
}

class Light extends PureComponent {

    static propTypes = {
        toggle: PropTypes.func.isRequired,
        data: ExtraPropTypes.light().isRequired,
        iconStyle: PropTypes.object,
    };

    handleToggle = () => {
        const {data: {id, power}, toggle} = this.props;
        toggle(id, power === 'on' ? 'off' : 'on');
    }

    render () {
        const {data: {id, power, connected, label}, toggle, iconStyle, ...rest} = this.props;

        return (
        <div
            {...rest}
            className={`light ${connected ? `power-${power}` : 'not-connected'}`}
            onClick={this.handleToggle}
        >
            <div className="light-icon" style={iconStyle}></div>
            <div className="light-name">{label}</div>
        </div>
        );
    }

}
