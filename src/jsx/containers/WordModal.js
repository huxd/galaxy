import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { wordModalActions,wordsMapActions,wordsActions } from '../actions';

var baseUrl = '/galaxy/public';
function UpdateTextArea(props) {
	if(!!props.edit)
		return <textarea rows={props.rows} id={props.id} value={props.content} onChange={props.handleChange} className='angel-textarea' autoFocus="true" onBlur={props.editChange}></textarea>
	else
		return <span id={props.id} onDoubleClick={props.editChange}>{props.content}</span>
}
function UpdateInputArea(props) {
	if(!!props.edit)
		return <input className='angel-input' id={props.id} value={props.content} onChange={props.handleChange} autoFocus="true" onBlur={props.editChange} />
	else
		return <span id={props.id} onDoubleClick={props.editChange}>{props.content}</span>
}
function TypeTags(props) {
	let tagItems = [];
	let ids = ['prep','conj','adj','adv','un','cn','v'];
	for(let key of ids) {
		if(!!props[key].typeFocus) {
			tagItems.push(<div className='tag tag-active' id={key} key={key} onClick={props.typeTagChange}>{key}</div>);
		}
		else {
			tagItems.push(<div className='tag tag-disable' id={key} key={key} onClick={props.typeTagChange}>{key}</div>);
		}
	}
	return (
		<div className='type-area clearfix'>
			{tagItems}
		</div>
	)
}
function VariantInputs(props) {
	let ids = ['did','done','doing','does','plural','more','most'];
	const variantItems = ids.map((id) => <td key={id}><UpdateInputArea {...props[id]} id={id} handleChange={props.handleChange} editChange={props.editChange}/></td>);
	return (
		<tr>{variantItems}</tr>
	)
}
class WordModal extends React.Component {
	constructor(props) {
		super(props);
		
		let type_ids = ['prep','conj','adj','adv','un','cn','v'];
		let input_ids = ['did','done','doing','does','plural','more','most','meaning','example','name','origin','pronun','family'];
		this.state = {};
		for(let id of type_ids) {
			this.state[id] = {
				typeFocus : false,
			}
		}
		for(let id of input_ids) {
			this.state[id] = {
				edit : false,
				content : 'none'
			}
		}
		this.state.name.content = props.status.word.name;
		this.state.origin.content = props.status.word.name;

		this.hideModal = this.hideModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.editChange = this.editChange.bind(this);
		this.addWord = this.addWord.bind(this);
		this.updateWord = this.updateWord.bind(this);
		this.typeTagChange = this.typeTagChange.bind(this);
		this.resetVariant = this.resetVariant.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		let word = nextProps.status.word;
		let state = _.clone(this.state, true);

		/*单词基本信息修改*/
		state.name.content = word.name;

		state.family.content = !!word.family ? word.family : 'none';
		state.origin.content = !!word.origin ? word.origin : word.name;
		state.pronun.content = !!word.pronun ? word.pronun : 'none';
		state.meaning.content = !!word.meaning && !!word.meaning.trim() ? word.meaning.trim() : 'none';
		state.example.content = word.example.trim() ? word.example.trim() : 'none';
		if(this.props.category == 'COMMON' || this.props.category == 'IGNORE')
			state.example.content = 'none';
		
		/*单词的Type区域修改*/
		let typeIds = ['prep','conj','adj','adv','un','cn','v'];
		for(let id of typeIds) 
			state[id].typeFocus = false;
		let typeTags = JSON.parse(word.lettertype);
		for(let typeTag of typeTags) 
			state[typeTag].typeFocus = true;

		/*单词的Variant区域修改*/
		let inputIds = ['did','done','doing','does','plural','more','most'];
		for(let id of inputIds) 
			state[id].content = 'none';
		let variant = JSON.parse(word.variant);
		for(let key in variant) 
			state[key].content = variant[key];

		this.setState(state);
	}
	typeTagChange(event) {
		let typeId = event.target.id;
		let state = _.clone(this.state,true);
		state[typeId].typeFocus = !state[typeId].typeFocus;
		let name = state['name'].content;
		let len = name.length;
		switch(typeId) {
			case 'v' :
				if(!state[typeId].typeFocus) {
					for(let variantId of ['did','done','doing','does'])
						state[variantId].content = 'none';
					break;
				}
				if(name[len - 1] == 'y') {
					state['doing'].content = name + 'ing';
					name = name.substr(0, len - 1) + 'i';
					state['does'].content = name + 'es';
				} else {
					state['does'].content = name + 's';
				}
				if(name[len - 1] == 'e')
					name = name.substr(0, len - 1);
				state['did'].content = name + 'ed';
				state['done'].content = name + 'ed';
				if(name[len - 1] != 'y')
					state['doing'].content = name + 'ing';
				break;
			case 'cn' :
				if(!state[typeId].typeFocus) {
					state['plural'].content = 'none';
					break;
				}
				name = name.replace(/([a-z]*s$)|([a-z]*x$)|([a-z]*ch$)|([a-z]*sh$)/,'$&es');
				name = name.replace(/([a-z]*[bcdfghjklmnpqrstvwxyz]+)(y)$/,'$1ies');
				if(name == state['name'].content)
					name = name + 's';
				state['plural'].content = name;
				break;
			case 'adj' :
				if(!state[typeId].typeFocus) {
					state['more'].content = 'none';
					state['most'].content = 'none';
					break;
				}
				name = name.replace(/([a-z]*)([e]{1})$/,'$1');
				if(name == state['name'].content) 
					name = name.replace(/([a-z]*[bcdfghjklmnpqrstvwxyz]+)(y)$/,'$1i');
				if(name == state['name'].content) 
					name = name.replace(/([bcdfghjklmnpqrstvwxyz]+[^bcdfghjklmnpqrstvwxyz]+)([bcdfghjklmnpqrstvwxz]{1})$/,'$1$2$2');
				state['more'].content = name + 'er';
				state['most'].content = name + 'est';
		}
		this.setState(state);
	}
	handleChange(event) {
		let state = _.clone(this.state,true);
		state[event.target.id].content = event.target.value;
		if(event.target.id == 'name')
			state['origin'].content = event.target.value;
		this.setState(state);
	}
	editChange(event) {
		let state = _.clone(this.state,true);
		state[event.target.id].edit = !state[event.target.id].edit;
		if(!state[event.target.id].content.trim())
			state[event.target.id].content = 'none';
		state[event.target.id].rows = (state[event.target.id].content).split(/\n/g).length + 5;
		this.setState(state);
	}
	hideModal() {
		this.props.dispatch(wordModalActions.hide());
	}
	get wordData() {
		let data = {};

		/*单词的基本信息*/
		data.meaning = this.state.meaning.content.trim();
		data.meaning = data.meaning == 'none' ? '' : '\n' + data.meaning;
		data.example = this.state.example.content.trim();
		data.example = data.example == 'none' ? '' : '\n' + data.example;
		data.name = this.state.name.content.trim();
		data.origin = this.state.origin.content.trim();
		data.pronun = this.state.pronun.content.trim();
		data.family = this.state.family.content.trim();
		data.family = data.family == 'none' ? '' : data.family;
		data.category = this.props.category;

		if(!data.category || !data.name || !data.origin) 
			return null;

		/*单词的Type区域数据*/
		let typeIds = ['prep','conj','adj','adv','un','cn','v']
		let lettertype = [];
		for(let id of typeIds) {
			if(!!this.state[id].typeFocus)
				lettertype.push(id); 
		}
		data.lettertype = JSON.stringify(lettertype);

		/*单词的Variant区域数据*/		
		let variantIds = ['did','done','doing','does','plural','more','most'];
		let variant = {};
		for(let id of variantIds) {
			if(this.state[id].content.trim() != 'none')
				variant[id] = this.state[id].content.trim();
		}
		data.variant = JSON.stringify(variant);

		return data;
	}
	addWord() {
		let data = this.wordData;
		if(!data)
			return;
		$.post(baseUrl + '/index.php/addWord',data,function(data) {
			if(data.status === 1) {
				//dispatch(wordsMapActions.add(data.word));
				this.props.dispatch(wordModalActions.hide());
				//this.props.dispatch(wordsActions.remove(word));
				console.log('success!');
			}
		}.bind(this));
	}
	updateWord() {
		let data = this.wordData;
		let word = this.props.status.word;
		if(!data || !word.id)
			return;
		data.id = word.id;
		$.post(baseUrl + '/index.php/updateWord', data, function(data) {
			if(data.status === 1) {
				console.log('success!');
			}
		});
	}
	resetVariant(event) {
		let state = _.clone(this.state,true);
		state[event.target.id].content = 'none';
		this.setState(state);
	}
	render() {
		let originClass = classNames({
			'origin-area' : true,
			'hide' : this.props.modalState == 'add' && !!this.props.status.word.id
		});
		let itemClass = classNames({
			'item' : true,
			'hide' : this.props.modalState == 'add' && !!this.props.status.word.id
		});
		let addBtnClass = classNames({
			'btn btn-info' : true,
			'hide' : this.props.modalState != 'add'
		});
		let updateBtnClass = classNames({
			'btn btn-info' : true,
			'hide' : this.props.modalState == 'add'
		});
		return (
			<Modal show={this.props.status.show} onHide={this.hideModal} dialogClassName="custom-modal" bsSize="large" id="show_character_modal">
				<div className='tabTag-area hide'>
					<div className='tabTag tabTag-active'>Hello!</div>
					<div className='tabTag tabTag-disable'>Hello!</div>
				</div>
				<Modal.Header closeButton className='clearfix'>
				</Modal.Header>
				<Modal.Body>
					<div className='name-area'><UpdateInputArea id='name' {...this.state.name} handleChange={this.handleChange} editChange={this.editChange} /></div>
					<div className={originClass}><span className='glyphicon glyphicon-tags'></span> Family:
						<UpdateInputArea id='family' {...this.state.family} handleChange={this.handleChange} editChange={this.editChange} />
					</div>
					<div className={originClass}><span className='glyphicon glyphicon-tags'></span> Origin:
						<UpdateInputArea id='origin' {...this.state.origin} handleChange={this.handleChange} editChange={this.editChange} />
					</div>
					<div className={originClass}><span className='glyphicon glyphicon-tags'></span> Pronun:
						<UpdateInputArea id='pronun' {...this.state.pronun} handleChange={this.handleChange} editChange={this.editChange} />
					</div>
					<div className='example-area'>
						<div className={itemClass}>
							<div className='title'><span className='glyphicon glyphicon-tags'></span> Type:</div>
							<TypeTags {...this.state} typeTagChange={this.typeTagChange}/>
						</div>
						<div className={itemClass}>
							<div className='title'><span className='glyphicon glyphicon-tags'></span> Meaning:</div>
							<div><UpdateTextArea id='meaning' {...this.state.meaning} handleChange={this.handleChange} editChange={this.editChange}/></div>
						</div>
						<div className='item'>
							<div className='title'><span className='glyphicon glyphicon-tags'></span> Example:</div>
							<div><UpdateTextArea id='example' {...this.state.example} handleChange={this.handleChange} editChange={this.editChange}/></div>
						</div>
						<div className={itemClass}>
							<div className='title'><span className='glyphicon glyphicon-tags'></span> Variant:</div>
							<Table bordered condensed striped>
								<tbody>
									<tr><th id='did'>did</th><th id='done'>done</th>
										<th id='doing'>doing</th><th id='does'>does</th>
										<th id='plural'>plural</th><th id='more' onDoubleClick={this.resetVariant}>more</th>
										<th id='most' onDoubleClick={this.resetVariant}>most</th></tr>
									<VariantInputs {...this.state} handleChange={this.handleChange} editChange={this.editChange}/>
								</tbody>
							</Table>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button type='button' className='btn btn-info pull-left hide'>MARK</button>
					<button type='button' className={addBtnClass} onClick={this.addWord}>ADD</button>
					<button type='button' className={updateBtnClass} onClick={this.updateWord}>UPDATE</button>
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		status : state.wordModal,
		wordsMap : state.wordsMap,
		category : state.categoryInfo.category
	}
}

export default connect(mapStateToProps)(WordModal);