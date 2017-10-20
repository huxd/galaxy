require('../less/study.less');

import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux';

import { reducers } from './reducers';
import Page from './containers/StudyPage';


const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

render(
	<Provider store={store}>
		<Page pageState={store.getState()}/>
	</Provider>,
	document.getElementById('root')
)