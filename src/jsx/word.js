require('../less/word.less');

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';

import { reducers } from './reducers';
import { Provider } from 'react-redux';
import WordPage from './containers/WordPage';

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

render (
	<Provider store={store}>
		<WordPage />
	</Provider>,
	document.getElementById('root')
)