import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { categoryActions,wordsMapActions } from '../actions';
import WordModal from '../containers/WordModal';
import Select from '../containers/Select';
import AddPanel from '../containers/AddPanel';
import UpdatePanel from '../containers/UpdatePanel';

var baseUrl = '/galaxy/public';

class WordPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			article : "",
			category : "",
			modalState : 'add'
		};
		this.handleChange = this.handleChange.bind(this);
		this.addCategory = this.addCategory.bind(this);
		this.changeOptionItems = this.changeOptionItems.bind(this);
		this.selectOption = this.selectOption.bind(this);
	}
	componentDidMount() {
		$.get(baseUrl + '/index.php/getWordsAll',function(data) {
			if(data.status === 1) {
				/*初始化选项菜单*/
				this.props.dispatch(categoryActions.init(data.categorys));

				/*初始化wordsMap*/
				this.props.dispatch(wordsMapActions.init(data.words));
			}
		}.bind(this));
	}
	handleChange(event) {
		let state = _.clone(this.state, true);
		state[event.target.id] = event.target.value;
		this.setState(state);
	}
	addCategory(event) {
		let category = this.state.category.trim();
		if(!category)
			return;
		let data = {category};
		$.post(baseUrl + '/index.php/addCategory', data, function(data) {
			if(data.status === 1) {
				this.props.dispatch(categoryActions.add(data.category));
				console.log('success');
			}
		}.bind(this));
	}
	changeOptionItems(event) {
		let state = _.clone(this.state,true);
		state.modalState = event.target.id;
		this.setState(state);
	}
	selectOption(option) {
		this.props.dispatch(categoryActions.set(option));
	}
	render() {
		let addOptionClass = classNames({
			'active' : this.state.modalState == 'add'
		});
		let updateOptionClass = classNames({
			'active' : this.state.modalState == 'update'
		});
		return (
			<div>
				<div className='option-list'>
					<ul className='option-items'>
						<li className={addOptionClass} onClick={this.changeOptionItems} id='add'>ADD</li>
						<li className={updateOptionClass} onClick={this.changeOptionItems} id='update'>UPDATE</li>
					</ul>
				</div>
				<WordModal modalState={this.state.modalState} splitArticle={this.splitArticle}/>
				<AddPanel modalState={this.state.modalState} />
				<UpdatePanel modalState={this.state.modalState} />
				<div className='category-area'>
					<Select {...this.props.categoryInfo} selectOption={this.selectOption}/>
					<div className='add-category-area'>
						<input className='angel-input' id='category' onChange={this.handleChange} value={this.state.category}/>
						<button className='btn btn-info' onClick={this.addCategory}>+</button>
					</div>
				</div>
			</div>
	    );
	}
}

function mapStateToProps(state) {
	return {
		categoryInfo : state.categoryInfo,
		wordsMap : state.wordsMap
	}
}

export default connect(mapStateToProps)(WordPage)