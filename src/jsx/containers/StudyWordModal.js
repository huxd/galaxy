import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { wordModalActions,wordsMapActions,wordsActions } from '../actions';



var isHomo = function(name1, name2, len) {
	let distance = 0;
	let j = 0;

	let basename = name1;
	let name = name2;
	let diff = name1.length - name2.length;
	if(name1.length < name2.length) {
		basename = name2;
		basename = name1;
		diff = -diff;
	}
	if(diff > len)
		return false;

	for(let i = 0; i < name.length; i++) {
		let c = name[i];
		if(c == basename[i + j]) {
			continue;
		}
		else {
			if(j < diff) {
				i--;
				j++;
			}
			distance++;
		}
		if(distance > len)
			return false;
	}
	return true;
}
var getHomoWords = function(wordsMap, category, word) {
	let homoArr = [];
	let hasWords = {};
	for(let wordsArr of wordsMap.values()) {
		for(let tempword of wordsArr) {
			if(tempword.state != 1 && tempword.category != 'COMMON' && tempword.category != category)
				continue;
			if(hasWords[tempword.name])
				break;
			let len = 1;
			if(isHomo(tempword.name, word.name, len) && tempword.name != word.name) {
				homoArr.push(tempword);
				hasWords[tempword.name] = true;
			}
			break;
		}
	}
	return homoArr;
}

var splitExamples = function(meaning, example) {
	let meanings = meaning.split('\n');
	let examples = example.split('\n');
	let i = 0;
	let infos = [];
	for(let key in  meanings) {
		let m = {};
		m.meaning = meanings[key];
		m.example = "";
		if(key == 0) {
			while(i < examples.length && !(new RegExp(".*\\(2\\)")).test(examples[i])) {
				m.example += examples[i] + '\n';
				i++;
			}
		}
		else {
			while(i < examples.length && (new RegExp(".*\\(" + (Number(key) + 1) + "\\)")).test(examples[i])) {
				examples[i] = examples[i].replace(new RegExp("\\("  + (Number(key) + 1) + "\\)"),'');
				m.example += examples[i] + '\n';
				i++;
			}
		}
		m.id = word.id + key;
		infos.push(m);
	}
	return infos;
}



var baseUrl = '/galaxy/public';
function OriginTags(props) {
	const originItems = [];
	for(let word of props.words) {
		if(word.name == props.word.name)
			continue;
		originItems.push(<a key={word.id} id={word.id} onClick={props.changeWord}>{word.name}</a>)
	}
	return (
		<div>
			{originItems}
		</div>
	)
}

function MeaningItem(props) {
	return (
		<div className='meaning-item'>
			<div className='meaning text-warning'><b> { props.meaning } </b></div>
			<div className='pre-wrap example text-muted' dangerouslySetInnerHTML={{__html: props.example}}></div>
		</div>
	)
}

function MeaningArea(props) {
	const meaningItems = props.meanings.map((item) => <MeaningItem key={item.id} meaning={ item.meaning } example={ item.example } />);
	return (
		<div>
			{meaningItems}
		</div>
	)
}


function FamilyItem(props) {
	return (
		<div className='item'>
			<div className='title'><span className='glyphicon glyphicon-tags'></span> {props.family}:</div>
			<OriginTags {...props}/>
		</div>
	)
}

function FamilyArea(props) {
	const familyItems = [];
	for(let family in props.familyMap) {
		if(props.familyMap[family].length <= 1)
			continue;
		familyItems.push(<FamilyItem changeWord={props.changeWord} key={family} family={family} words={props.familyMap[family]} word={props.word} />)
	}
	return (
		<div>
			{familyItems}
		</div>
	);
}

class StudyWordModal extends React.Component {
	constructor(props) {
		super(props);
		let input_ids = ['meaning','example','name','origin','pronun'];
		this.state = {};
		for(let id of input_ids) {
			this.state[id] = {
				edit : false,
				content : 'none'
			}
		}
		this.state.meanings = [];
		this.state.name.content = props.status.word.name;
		this.state.origin.content = props.status.word.name;
		this.state.originWords = [];
		this.state.homoWords = [];

		this.hideModal = this.hideModal.bind(this);
		this.changeWord = this.changeWord.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		let word = nextProps.status.word;
		let state = _.clone(this.state,true);


		/*基本信息展示*/
		state.name.content = word.name.trim();
		state.pronun.content = word.pronun;
		state.origin.content = !!word.origin ? word.origin : word.name;
		state.originWords = !!this.props.originMap[word.origin] ? this.props.originMap[word.origin] : [];

		var meaning = word.meaning.trim();
		var example = word.example.trim();

		/*将例子单词高亮显示*/
		let variant = JSON.parse(word.variant);
		variant.origin = word.name;
		for(let key in variant) {
			if(variant[key] != 'none')
				example = example.replace(new RegExp(variant[key],'igm'), '<span class="text-danger"><b>$&</b></span>');
		}
		
		let familyMap = this.props.familyMap;
		let familys = word.family.split(':');
		state.familyMap = {};
		for(let family of familys) {
			if(!family)
				continue;
			if(!!familyMap[family])
				state.familyMap[family] = familyMap[family];
		}

		/*拆分释义和例子*/
		state.meanings = splitExamples(meaning, example);

		/*寻找该单词的同形词*/
		state.homoWords = getHomoWords(nextProps.wordsMap, this.props.category, word);


		this.setState(state);
	}
	changeWord(event) {
		let id = event.target.id;
		$.get(baseUrl + '/index.php/getWordById?id=' + id,function(data) {
			if(data.status === 1) {
				this.props.dispatch(wordModalActions.displayWord(data.word));
			}
		}.bind(this));
	}
	hideModal() {
		this.props.dispatch(wordModalActions.hide());
	}
	render() {
		var sameOriginClass = classNames({
			item : true,
			hide : this.state.originWords.length <= 1
		});
		var homographClass = classNames({
			item : true,
			hide : this.state.homoWords.length == 0
		});

		return (
			<Modal show={this.props.status.show} onHide={this.hideModal} dialogClassName="custom-modal" bsSize="large" id="show_character_modal">
				<Modal.Header closeButton className='clearfix'>
				</Modal.Header>
				<Modal.Body>
					<div className='name-area'><span>{this.state.name.content}</span> </div>
					<div className='pronun-area text-muted'><b>{this.state.pronun.content}</b></div>
					<div className='example-area'>
						<div className={sameOriginClass}>
							<div className='title'><span className='glyphicon glyphicon-tags'></span> Same Origin:</div>
							<OriginTags changeWord={this.changeWord} words={this.state.originWords} word={this.props.status.word} />
						</div>
						<div className={homographClass}>
							<div className='title'><span className='glyphicon glyphicon-tags'></span> Homograph:</div>
							<OriginTags changeWord={this.changeWord} words={this.state.homoWords} word={this.props.status.word} />
						</div>
						<FamilyArea changeWord={this.changeWord} familyMap={this.state.familyMap} word={this.props.status.word} />
						<div className='item'>
							<div className='title'><span className='glyphicon glyphicon-tags'></span> Meaning:</div>
							<MeaningArea meanings={this.state.meanings} />
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		status : state.wordModal,
		wordsMap : state.wordsMap,
		originMap : state.originMap,
		category : state.categoryInfo.category,
		familyMap : state.familyMap
	}
}

export default connect(mapStateToProps)(StudyWordModal);