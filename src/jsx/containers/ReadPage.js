import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { wordModalActions,categoryActions,wordsMapActions,wordsActions } from '../actions';
import Select from '../containers/Select';

var baseUrl = '/galaxy/public';

class ReadPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			article : "",
			novel : ""
		};
		this.changeWords = this.changeWords.bind(this);
		this.splitArticle = this.splitArticle.bind(this);
		this.selectOption = this.selectOption.bind(this);
	}
	componentDidMount() {
		$.get(baseUrl + '/index.php/getWordsAll',function(data) {
			if(data.status === 1) {
				this.props.dispatch(categoryActions.init(data.categorys));

				this.props.dispatch(wordsMapActions.init(data.words));
			}
		}.bind(this));
	}
	splitArticle(event) {
		let state = _.clone(this.state, true);
		state.article = event.target.value;
		this.setState(state, () => this.changeWords(this.props.categoryInfo.category));
	}
	changeWords(category) {
		let allWordsMap = this.props.wordsMap;
		let state = _.clone(this.state, true);
		let novel = this.state.article;
		var article = (this.state.article).replace(/((Mr)|(Mrs)|(St))\./g,'$1,');
		article = article.replace(/\.\.\./g,',,,');
		var sentences = article.split(/\.|\!|\?|;/);
		var wordsMap = {};
		let unknownWords = [];
		let keyWords = [];
		for(let i in sentences) {
			let sentence = sentences[i].replace(/((Mr)|(Mrs)|(St)),/g,'$1.');
			sentence = sentence.replace(/,,,/g,'...');
			sentence = sentence.replace(/\n/g,' ') + '.';
			sentence = sentence.replace(/‘|’/g,'\'');
			sentence = sentence.trim();
			let wordsArr = sentences[i].split(/\s|,|:|‘|’|“|”|\(|\)|"|'|—|\$|#|-|\[|\]|\{|\}|\\|\<|\>|\//);
			for(let word of wordsArr) {
				if(!word || /[0-9]+/.test(word))
					continue;
				word = word.toLowerCase();
				if (!allWordsMap.has(word) && !wordsMap[word]) {
					if(word == 'din' || word == 'den')
						continue;
					unknownWords.push(word);
					wordsMap[word] = true;
				}
				else if(allWordsMap.has(word) && category != 'COMMON' && category != 'IGNORE') {
					let has = false;
					for(let w of allWordsMap.get(word)) {
						if(w.category == 'COMMON' || w.category == 'IGNORE' || w.state == 1) {
							has = true;
						}
						if(w.category == category && w.state == 1 && !wordsMap[word]) {
							keyWords.push(word);
							wordsMap[word] = true;
						}
						if(w.category == category && w.state != 1) {
							has = false;
							break;
						}
					}
					if(!has && !wordsMap[word]) {
						unknownWords.push(word);
						wordsMap[word] = true;
					}
				}
			}
		}
		novel = novel.replace(/\n/g, '\n\n');
		novel = novel.replace(/—/g, '-');
		for(let word of keyWords)
			novel = novel.replace(new RegExp('([“ \\-’])(' + word +')([ ;,\\.\\-\\?\\!\\:’]+)','igm'),'$1<span class="text-success"><b>$2</b></span>$3');
		for(let word of unknownWords)
			novel = novel.replace(new RegExp('([“ \\-’])(' + word +')([ ;,\\.\\-\\?\\!\\:’]+)','igm'),'$1<span class="text-danger"><b>$2</b></span>$3');

		let blackWords = {
			'aimin’' : 'aiming',
			'ter' : 'to',
			'mist’' : 'Mr. ',
			'‘cause' : 'Because',
			'ef' : 'if',
			'ain’' : 'ain’t',
			'gwine' : 'going to',
			'git' : 'get',
			'an’' : 'and',
			'de' : 'the',
			'dey' : 'they',
			'din’' : 'didn’t',
			'den' : 'then',
			'Ah' : 'I',	
			'mek' : 'make',
			'lak' : 'like',
			'sho' : 'sure',
			'‘bout' : 'about',
			'talkin’' : 'talking',
			'gittin’' : 'getting',
			'w’en' : 'when',
			'mah’ied' : 'married',
			'Huccome' : 'How can',
			'spyin’' : 'spying',
			'w’ite' : 'white',
			'han’' : 'hand',
			'po’' : 'poor',
			'fo’' : 'fo(u)r',
			'mo’n' : 'more than',
			'‘lect' : 'elect',
			'frum' : 'from',
			'gempmum' : 'gentlemen',
			'‘stead' : 'instead',
			'nothin’' : 'nothing',
			'‘cept' : 'except',
			'dat' : 'that',
			'mahseff' : 'myself',
			'figgered' : 'figured',
			'awficers' : 'officers',
			'mo’' : 'more',
			'agin' : 'again',
			'ternight' : 'tonight',
			'nex’' : 'next',
			'fer' : 'for',
			'tek' : 'take',
			'doan' : 'don’t',
			'dan' : 'than',
			'havin’' : 'having',
			'ast' : 'ask',
			'fust' : 'first',
			'ruther' : 'rather',
			'dem' : 'them',
			'wid' : 'with',
			'tole' : 'told',
			'yo’' : 'your',
			'whar' : 'what',
			'hyah' : 'here',
			'nuthin’' : 'nothing',
			'chile' : 'child',
			'jes' : 'just',
			'ole' : 'old',
			'wuz' : 'was',
			'dis' : 'this',
			'whut' : 'what',
			'Yas’m' : 'Yes madam',
			'lil' : 'little',
			'sayin' : 'saying',
			'allus' : 'always',
			'fe’el' : 'field',
			'gempmums' : 'gentlemen',
			'mah' : 'my',
			'kain' : 'cannot',
			'sumpin' : 'something',
			'sech' : 'such',
			'dar' : 'that',
			'No’m' : 'No madam',
			'nawsuh' : 'No sir',
			'y’all' : 'you all'
		};
		for(let word in blackWords)
			novel = novel.replace(new RegExp('([“ \\-’])(' + word +')([ ;,\\.\\-\\?\\!\\:’]+)','igm'),'$1<span class="text-info">' + blackWords[word] + '</span><span class="text-muted">($2)</span>$3');
		state.novel = novel;
		this.setState(state);
	}
	selectOption(option) {
		this.props.dispatch(categoryActions.set(option));
		this.changeWords(option);
	}
	render() {
		return (
			<div>
				<div className='panel panel-info'>
					<div className='panel-body'>
						<div className='article-area'>
							<textarea className='angel-textarea' value={this.state.article} onChange={this.splitArticle} id='article'></textarea>
							<div className='article' dangerouslySetInnerHTML={{__html: this.state.novel}}>
							</div>
						</div>
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
		categoryInfo : state.categoryInfo,
		wordsMap : state.wordsMap
	}
}

export default connect(mapStateToProps)(ReadPage)