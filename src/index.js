
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';

import 'index.html';

const render = Klass =>
    ReactDOM.render(<Klass />, document.getElementById('app'));

if (module.hot) module.hot.accept();

render(App);
