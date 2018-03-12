import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { wordModalActions,wordsMapActions,wordsActions } from '../actions';
import {UpdateTextArea, UpdateInputArea} from '../components/updateArea';
var baseUrl = '/galaxy/public';

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
    const variantItems = ids.map((id) => <td key={id}><input value={props[id].content} className='angel-input' id={id} onChange={props.handleChange} /></td>);
    return (
        <tr>{variantItems}</tr>
    )
}

function MeaningArea(props) {
    const meaningId = "meaning_" + props.id;
    const exampleId = "example_" + props.id;
    const categoryId = "category_" + props.id;
    const optionItems = props.categorys.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)
    return (
        <div className='meaning-area'>
            <div className='meaning-item'>
                <textarea rows="1" className='angel-textarea' id={meaningId} placeholder='meaning' value={props.meaning} onChange={props.handleChange} ></textarea>
                <textarea rows="3" className='angel-textarea' id={exampleId} placeholder='example' value={props.example} onChange={props.handleChange} ></textarea>
            </div>
            <select onChange={props.handleChange} id={categoryId} value={props.category}>
                {optionItems}
            </select>
            <div className='del-meaning-btn-area'><button className='btn btn-danger btn-circle' id={props.id} onClick={props.deleteMeaningArea}><span className="glyphicon glyphicon-remove" id={props.id}></span></button></div>
        </div>
    )
}
function MeaningAreas(props) {
    let meaningAreas = [];
    for(let meaningItem of props.meanings) {
        if(meaningItem.state != 'delete') {
            meaningAreas.push(<MeaningArea categorys={props.categoryInfo.categorys} key={meaningItem.id} {...meaningItem} deleteMeaningArea={props.deleteMeaningArea} handleChange={props.handleChange} />);
        }
    }
    return (
        <div>{meaningAreas}</div>
    )
}

class WordModal extends React.Component {
    constructor(props) {
        super(props);
        
        let type_ids = ['prep','conj','adj','adv','un','cn','v'];
        let input_ids = ['did','done','doing','does','plural','more','most','name','origin','pronun','family'];
        this.state = {};
        for(let id of type_ids) {
            this.state[id] = {
                typeFocus : false,
            }
        }
        for(let id of input_ids) {
            this.state[id] = {
                content : ''
            }
        }

        /*初始化meanings相关信息*/
        this.state.meaningId = 0;
        this.state.meanings = props.status.word.meanings;
        

        this.state.name.content = props.status.word.name;
        this.state.origin.content = props.status.word.name;
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addWord = this.addWord.bind(this);
        this.updateWord = this.updateWord.bind(this);
        this.typeTagChange = this.typeTagChange.bind(this);
        this.resetVariant = this.resetVariant.bind(this);
        this.addMeaningArea = this.addMeaningArea.bind(this);
        this.deleteMeaningArea = this.deleteMeaningArea.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let word = nextProps.status.word;
        let state = _.clone(this.state, true);
        /*单词基本信息修改*/
        state.name.content = word.name;
        state.family.content = !!word.family ? word.family : '';
        state.origin.content = !!word.origin ? word.origin : word.name;
        state.pronun.content = !!word.pronun ? word.pronun : '';
        state.meaningId = 0;
        state.meanings = !!word.meanings ? word.meanings : [];
        if(this.props.category == 'COMMON' || this.props.category == 'IGNORE') {
            //state.meanings = '';
        }

        /*单词的Type区域修改*/
        let typeIds = ['prep','conj','adj','adv','un','cn','v'];
        for(let id of typeIds) 
            state[id].typeFocus = false;
        let typeTags = JSON.parse(word.lettertype);
        for(let typeTag of typeTags) 
            state[typeTag].typeFocus = true;
        //state[event.target.id].rows = (state[event.target.id].content).split(/\n/g).length + 5;

        /*单词的Variant区域修改*/
        let inputIds = ['did','done','doing','does','plural','more','most'];
        for(let id of inputIds) {
            state[id].content = '';
        }
        let variant = JSON.parse(word.variant);
        for(let key in variant) {
            state[key].content = variant[key];
        }

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
                    for(let variantId of ['did','done','doing','does']) {
                        state[variantId].content = '';
                    }
                    break;
                }
                if(name[len - 1] == 'y') {
                    state['doing'].content = name + 'ing';
                    name = name.substr(0, len - 1) + 'i';
                    state['does'].content = name + 'es';
                } else {
                    state['does'].content = name + 's';
                }
                if(name[len - 1] == 'e') {
                    name = name.substr(0, len - 1);
                }
                state['did'].content = name + 'ed';
                state['done'].content = name + 'ed';
                if(name[len - 1] != 'y') {
                    state['doing'].content = name + 'ing';
                }
                break;
            case 'cn' :
                if(!state[typeId].typeFocus) {
                    state['plural'].content = '';
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
                    state['more'].content = '';
                    state['most'].content = '';
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
        let state = _.clone(this.state, true);
        if(event.target.id == 'name') {
            state['origin'].content = event.target.value;
        }
        let keys = event.target.id.split('_');
        if(keys[0] == 'example' || keys[0] == 'meaning' || keys[0] == 'category') {
            let idStr = keys[1];
            if(keys.length === 3) {
                idStr += '_' + keys[2];
            }
            let meanings = state.meanings;
            for(let i = 0; i < meanings.length; i++) {
                if(meanings[i].id == idStr) {
                    meanings[i][keys[0]] = event.target.value;
                    break;
                }
            }
        } else {
            state[event.target.id].content = event.target.value;
        }
        this.setState(state);
    }
    addMeaningArea(event) {
        let state = _.clone(this.state, true);
        let meaningItem = {
            meaning : '',
            example : '',
            id : 'add_' + state.meaningId
        };
        meaningItem.category = this.props.category;
        state.meaningId++;
        state.meanings.push(meaningItem);
        this.setState(state);
    }
    deleteMeaningArea(event) {
        let state = _.clone(this.state, true);
        let idStr = event.target.id;
        let meanings = state.meanings;
        for(let i = 0; i < meanings.length; i++) {
            if(meanings[i].id == idStr) {
                if(idStr[0] == 'a') {
                    meanings.splice(i, 1);
                } else {
                    meanings[i].state = 'delete';
                }
                break;
            }
        }
        this.setState(state);
    }
    hideModal() {
        this.props.dispatch(wordModalActions.hide());
    }
    get wordData() {
        let data = {};
        /*单词的基本信息*/
        data.name = this.state.name.content.trim();
        data.origin = this.state.origin.content.trim();
        data.pronun = this.state.pronun.content.trim();
        data.family = this.state.family.content.trim();
        data.category = this.props.category;

        if(!data.category || !data.name || !data.origin) 
            return null;

        /*单词的Type区域数据*/
        let typeIds = ['prep','conj','adj','adv','un','cn','v']
        let lettertype = [];
        for(let id of typeIds) {
            if(!!this.state[id].typeFocus) {
                lettertype.push(id); 
            }
        }
        data.lettertype = JSON.stringify(lettertype);

        /*单词的Variant区域数据*/      
        let variantIds = ['did','done','doing','does','plural','more','most'];
        let variant = {};
        for(let id of variantIds) {
            if(this.state[id].content.trim() != '') {
                variant[id] = this.state[id].content.trim();
            }
        }
        data.variant = JSON.stringify(variant);

        /*单词的Meaning区域数据*/
        //TODO：ADD的时候逻辑修改
        data.meanings = this.state.meanings;
        for(let i = 0; i < data.meanings.length; i++) {
            if(data.meanings[i].meaning.trim() == '' && data.meanings[i].example.trim() == '') {
                data.meanings.splice(i, 1);
                i--;
                continue;
            }
            if(data.meanings[i].state == 'delete') {
                continue;
            }
            if(data.meanings[i].id[0] == 'a') {
                data.meanings[i].state = 'add';
            } else {
                data.meanings[i].state = 'update';
            }
        }
        if((this.props.category == "COMMON" || this.props.category == "IGNORE") && this.props.modalState == 'add') {
            data.meanings = [];
        }
        data.meanings = JSON.stringify(data.meanings);

        return data;
    }
    addWord() {
        let data = this.wordData;
        console.log(data);
        //return;
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
        console.log(data);
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
        state[event.target.id].content = '';
        this.setState(state);
    }
    render() {
        let originClass = classNames({
            'origin-area' : true,
            'hide' : this.props.modalState == 'add' && !!this.props.status.word.id
        });
        let itemClass = classNames({
            'item-area' : true,
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
                    <div className='name-area'><input className='angel-input' id='name' value={this.state.name.content} onChange={this.handleChange} /></div>
                    <div className={originClass}><span className='glyphicon glyphicon-tags'></span> <label>Family:</label>
                        <input className='angel-input' value={this.state.family.content} id='family' onChange={this.handleChange} />
                    </div>
                    <div className={originClass}><span className='glyphicon glyphicon-tags'></span> <label>Origin:</label>
                        <input className='angel-input' value={this.state.origin.content} id='origin' onChange={this.handleChange} />
                    </div>
                    <div className={originClass}><span className='glyphicon glyphicon-tags'></span> <label>Pronun:</label>
                        <input className='angel-input' value={this.state.pronun.content} id='pronun' onChange={this.handleChange} />
                    </div>
                    <div className={itemClass}>
                        <div className='title'><span className='glyphicon glyphicon-tags'></span> <label>Type:</label></div>
                        <TypeTags {...this.state} typeTagChange={this.typeTagChange}/>
                    </div>
                    <div className={itemClass}>
                        <div className='title'><span className='glyphicon glyphicon-tags'></span> <label>Variant:</label></div>
                        <Table bordered condensed striped>
                            <tbody>
                                <tr><th id='did'>did</th><th id='done'>done</th>
                                    <th id='doing'>doing</th><th id='does'>does</th>
                                    <th id='plural'>plural</th><th id='more' onDoubleClick={this.resetVariant}>more</th>
                                    <th id='most' onDoubleClick={this.resetVariant}>most</th></tr>
                                <VariantInputs {...this.state} handleChange={this.handleChange} />
                            </tbody>
                        </Table>
                    </div>
                    <div className={itemClass}>
                        <div className='title'><span className='glyphicon glyphicon-tags'></span> <label>Meaning:</label></div>
                        <MeaningAreas {...this.state} categoryInfo={this.props.categoryInfo} deleteMeaningArea={this.deleteMeaningArea} handleChange={this.handleChange} />
                        <div className='add-meaning-btn-area'><button className='btn btn-success btn-circle' onClick={this.addMeaningArea} ><span className="glyphicon glyphicon-plus"></span></button></div>
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
        category : state.categoryInfo.category,
        categoryInfo : state.categoryInfo
    }
}

export default connect(mapStateToProps)(WordModal);