import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Wordspanels from '../components/Wordspanels';


var splitArticle = function(article, category, wordsMap) {
	article = article.replace(/((Mr)|(Mrs)|(St))\./g,'$1,');
	//article = article.replace(/\.{3}/g,',,,');
	let sentences = article.split(/\.|\!|\?|;/);
	let wordsInfo = {};
	let usefulWords = [];
	for(let i in sentences) {
		let sentence = sentences[i].replace(/((Mr)|(Mrs)|(St)),/g,'$1.');
		//sentence = sentence.replace(/,,,/g,'...');
		sentence = sentence.replace(/‘|’/g,'\'');
		sentence = sentence.trim();
		let wordsArr = sentence.split(/\s|,|_|\*|\&|\%|\+|=|~|:|‘|’|“|”|\(|\)|"|'|—|\$|#|-|\[|\]|\{|\}|\\|\<|\>|\//);
		for(let name of wordsArr) {
			if(!name || /[0-9]+/.test(name))
				continue;
			name = name.toLowerCase();
			if(wordsMap.has(name)) {
				name = wordsMap.get(name)[0].name;
			}
			let word = wordsInfo[name];
			if(!!word) {
				word.count++;
				word.example += '\n';
				word.example += sentence;
			}
			else {
				word = {
					count : 1,
					example : sentence,
					name : name,
					lettertype : '[]',
					variant : '{}'
				};
				wordsInfo[name] = word;
				if(!wordsMap.has(name))
					usefulWords.push(word);
				else if(category != 'COMMON' && category != 'IGNORE') {
					let has = false;
					for(let w of wordsMap.get(name)) {
						if(w.category == 'COMMON' || w.category == 'IGNORE' || w.state == 1) {
							has = true;
						}
						if(w.category == category && w.state != 1) {
							has = false;
							break;
						}
					}
					if(!has)
						usefulWords.push(word);
				}
			}
		}
	}
	return usefulWords;
}

var letterToWordMap = function(usefulWords) {
	let words = {};
	let i = 0;
	let all = 0;
	let ratioMap = [];
	for(let i = 1; i <= 20; i++)
		ratioMap[i] = 0;
	let num = 0;
	for(let word of usefulWords) {
		let letter = word.name[0].toUpperCase();
		let count = word.count;
		if(count != num) {
			num = count;
			console.log("<<< " + num + " >>>\n");
		}
		console.log(word.name);
		if(count >= 0) {
			if(!!words[letter]) {
				words[letter].push(word)
			} else {
				words[letter] = [word];
			}
		}
		if(count >= 20)
			ratioMap[20] += count;
		else
			ratioMap[count] += count;
		all += count;
		i++;
	}
	
	console.log("<<<ratio>>>");
	console.log("------------------");
	let ratio = 0.0;
	for(let i = 20; i >= 1; i--) {
		console.log(i + " --> " + (ratioMap[i] / all) * 100 + '%');
		ratio += ratioMap[i] / all;
		if(ratio > 0.5) {
			console.log("<<< " + ratio * 100 + "% >>>");
		}
	}
	console.log(all);
	console.log("------------------");
	
	return words;
}

class Panel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			article : "",
			words : {}
		};
		this.getWords = this.getWords.bind(this);
		this.handleArticleChange = this.handleArticleChange.bind(this);
	}
	componentWillReceiveProps(newProps) {
		if(newProps.modalState == 'add') {
			if(newProps.category != this.props.category || this.props.modalState == 'update') {
				let words = this.getWords(newProps.category, this.state.article);
				this.setState({
					words : words
				});
			}
		}
	}
	getWords(category, article) {
		let usefulWords = splitArticle(article, category, this.props.wordsMap);
		usefulWords.sort(function(a,b) {
			return b.count - a.count;
		});
		return letterToWordMap(usefulWords);
	}
	handleArticleChange(event) {
		let article = event.target.value;
		let words = this.getWords(this.props.category, article);
		this.setState({
			article : article,
			words : words
		});
	}
	render() {
		let panelClass = classNames({
			'panel' : true,
			'panel-info' : true,
			'hide' : this.props.modalState != 'add'
		});
		return (
			<div className={panelClass}>
				<div className='panel-body'>
					<div className='article-area'>
						<textarea className='angel-textarea' value={this.state.article} onChange={this.handleArticleChange} id='article'></textarea>
					</div>	
					<Wordspanels {...this.state}/>
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