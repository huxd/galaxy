import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';

import { categoryActions,wordsMapActions,originMapActions,familyMapActions } from '../actions';
import WordModal from '../containers/StudyWordModal';
import Select from '../containers/Select';
import Wordspanels from '../components/Wordspanels';

var baseUrl = '/galaxy/public';

var getReviewWords = function(words) {
	/*从Cookie中读取信息*/
	let reviewInfoJson = !!Cookie.get('review') ? Cookie.get('review') : '{}';
	let reviewInfo = JSON.parse(reviewInfoJson);
	let date = new Date();
	if(date.getDate() == reviewInfo.date) {
		return reviewInfo.words;
	}

	/*要复习的单词集合*/
	let viWords = [];
	for(let word of words) {
		if(word.state == 1) {
			viWords.push(word);
		}
	}
	let len = parseInt(viWords.length * 0.05);
	let reviewWords = [];
	let hasWord = {};
	for(let i = 0; i < len; i++) {
		let index = Math.floor(Math.random() * viWords.length);
		let id = viWords[index].id;
		if(!!hasWord[id])
			i--;
		else {
			hasWord[id] = true;
			reviewWords.push(id);
		}
	}
	reviewInfo.date = date.getDate();
	reviewInfo.words = reviewWords;
	Cookie.set('review', JSON.stringify(reviewInfo), {expires:31});

	return reviewWords;
}

class StudyPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			words : {}
		};
		this.getWords = this.getWords.bind(this);
		this.selectOption = this.selectOption.bind(this);
	}
	componentDidMount() {
		$.get(baseUrl + '/index.php/getWordsAll',function(data) {
			if(data.status === 1) {
				this.props.dispatch(categoryActions.init(data.categorys));

				let reviewWords = getReviewWords(data.words);

				let originMap = {};	
				for(let word of data.words) {
					if(word.state == 1 && reviewWords.indexOf(word.id) > -1) {
						word.review = true;
					}
					if(!originMap[word.origin])
						originMap[word.origin] = [word];
					else
						originMap[word.origin].push(word);
				}
				this.props.dispatch(originMapActions.init(originMap));

				/*初始化wordsMap*/
				this.props.dispatch(wordsMapActions.init(data.words));

				/*初始化familyMap*/
				this.props.dispatch(familyMapActions.init(data.words));

				/*初始化单词集合*/
				let category = data.categorys[0].name;
				let words = this.getWords(category);
				this.setState({ 
					words : words
				});
			}
		}.bind(this));
	}
	componentWillReceiveProps(newProps) {
		if(newProps.categoryInfo.category != this.props.categoryInfo.category) {
			let words = this.getWords(newProps.categoryInfo.category);
			this.setState({ 
				words : words
			});
		}
	}
	getWords(category) {
		let wordsMap = this.props.wordsMap;
		let usefulWords = [];
		let wordsInfo = {};
		for(let wordsArr of wordsMap.values()) {
			for(let word of wordsArr) {
				if(word.category == category && !wordsInfo[word.name]) {
					wordsInfo[word.name] = word;
					usefulWords.push(word.name);
					break;
				}
			}
		}
		usefulWords.sort();
		var words = {};
		for(let word of usefulWords) {
			var letter = word[0].toUpperCase();
			if(!!words[letter]) {
				words[letter].push(wordsInfo[word]);
			} else {
				words[letter] = [wordsInfo[word]];
			}
		}
		return words;
	}
	selectOption(option) {
		this.props.dispatch(categoryActions.set(option));
	}
	render() {
		return (
			<div>
				<div className='panel panel-info'>
					<WordModal />
					<div className='panel-body'>
						<Wordspanels {...this.state} />
					</div>
					<div className='category-area'>
						<Select {...this.props.categoryInfo} selectOption={this.selectOption}/>
					</div>
				</div>
			</div>
	    );
	}
}

function mapStateToProps(state) {
	return {
		categoryInfo: state.categoryInfo,
		wordsMap : state.wordsMap
	}
}

export default connect(mapStateToProps)(StudyPage)