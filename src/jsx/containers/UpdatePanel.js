import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { wordsActions } from '../actions';
import Wordspanels from '../components/Wordspanels';

class Panel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			words : {}
		};
		this.getWords = this.getWords.bind(this);
	}
	componentWillReceiveProps(newProps) {
		if(newProps.modalState == 'update') {
			if(newProps.category != this.props.category || this.props.modalState == 'add') {
				let words = this.getWords(newProps.category);
				this.setState({ 
					words : words
				});
			}
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
	render() {
		let panelClass = classNames({
			'panel' : true,
			'panel-info' : true,
			'hide' : this.props.modalState != 'update'
		});
		return (
			<div className={panelClass}>
				<div className='panel-body'>
					<Wordspanels {...this.state} />
				</div>
			</div>
		);
	}
}
export default connect(function(state) {
	return {
		category : state.categoryInfo.category,
		wordsMap : state.wordsMap
	}
})(Panel);