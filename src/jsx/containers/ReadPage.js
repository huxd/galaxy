import React from 'react';
import { Modal,Table,Popover,Overlay } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { wordModalActions,categoryActions,wordsMapActions,wordsActions } from '../actions';
import Select from '../containers/Select';
import Cookies from 'js-cookie';

var baseUrl = '/galaxy/public';

function Article(props) {
    let wordItems = [];
    for(let word of props.words) {
        let item = null;
        switch(word.type) {
            case 'unknown' :
                item = (<span key={word.key} className='word text-muted'>{word.name}</span>);
                break;
            case 'other' :
                item = (
                    <span key={word.key} onClick={props.handleClick} className='word special-word text-success' id={word.id}>{word.name}</span>     
                );
                break;
            case 'current' :
                item = (
                    <span key={word.key} onClick={props.handleClick} className='word special-word text-primary' id={word.id}>{word.name}</span>     
                );
                break;
            default :
                item = (<span key={word.key}>{word.name}</span>);
        }
        wordItems.push(item);

    }
    return (
        <div className='article' onClick={props.hidePopover}>
            <Overlay show={props.show} target={props.target} placement="top" container={this}>
                <Popover id="popover-positioned-top" title={props.word.pronun}>
                    {props.word.meanings[0].meaning}
                </Popover>
            </Overlay>
            {wordItems}
        </div>
    )
}

class ReadPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            article : "",
            novel : "",
            words : [],
            word : {
                name : '',
                meanings : [{'meaning' : ''}]
            }
        };

        this.handleClick = e => {
            let id = e.target.id;
            let target = e.target;
            $.get(baseUrl + '/index.php/getWordById?id=' + id, function(data) {
                if(data.status === 1) {
                    data.word.meanings = data.meanings;
                    let show = !this.state.show;
                    if(!show && target != this.state.target) {
                        show = !show;
                    }
                    this.setState({ target: target, show: show, word : data.word});
                }
            }.bind(this));
            e.stopPropagation();
        };

        this.hidePopover = e => {
            this.setState({show : false});
        }
        

        this.changeWords = this.changeWords.bind(this);
        this.splitArticle = this.splitArticle.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }
    componentDidMount() {
        $.get(baseUrl + '/index.php/getWordsAll',function(data) {
            if(data.status === 1) {
                this.props.dispatch(categoryActions.init(data.categorys));
                this.props.dispatch(categoryActions.set("DAVID COPPERFIELD"));
                /*初始化wordsMap*/
                let meaningsMap = new Map();
                for(let meaning of data.meanings) {
                    if(!meaningsMap.has(meaning.word_id)) {
                        meaningsMap.set(meaning.word_id, [meaning]);
                    } else {
                        meaningsMap.get(meaning.word_id).push(meaning);
                    }
                }
                for(let word of data.words) {
                    word.meanings = [];
                    if(meaningsMap.has(word.id)) {
                        word.meanings = meaningsMap.get(word.id);
                    }
                }
                this.props.dispatch(wordsMapActions.init(data.words));
                $.get(baseUrl + '/index.php/getArticle',function(data) {
                    if(data.status === 1) {
                        let url = location.search;
                        let chapter = 0;
                        if (url.indexOf("?") != -1) {
                           var str = url.substr(1);
                           chapter = str.split('=')[1];
                        }
                        let chapters = data.article.content.split(/Chapter [0-9]+/g);
                        if(!!Cookies.get('chapter') && (chapter == 0 || chapter == Cookies.get('chapter'))) {
                            chapter = Cookies.get('chapter');
                            scroll = Cookies.get('scroll');
                            $('html').animate({'scrollTop' : scroll});
                        } else if(chapter == 0) {
                            chapter = 1;
                        }
                        let article = chapters[chapter].trim();
                        article = "Chapter " + chapter + '\n\n' + article;
                        Cookies.set('chapter', chapter, {expires:31});
                        console.log(this.props.categoryInfo);
                        this.setState({article : article}, () => this.changeWords(this.props.categoryInfo.category));
                    }
                }.bind(this));
            }
        }.bind(this));

         window.addEventListener('scroll', () => {
            Cookies.set('scroll', $(document).scrollTop(), {expires:31});
         });
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
        let name = '';
        let tmpNovel = '';
        let id = 0;
        let words = [];
        for (let i in novel) {
            let ch = novel[i];
            if((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
                name += ch;
                if(i != novel.length - 1) {
                    continue;
                }
                ch = '';
            }
            let lword = name.toLowerCase();
            let word = {};
            if (!!name && !allWordsMap.has(lword)) {
                word.name = name;
                word.type = 'unknown';
            } else if(!!name && category != 'COMMON' && category != 'IGNORE') {
                for(let w of allWordsMap.get(lword)) {
                    if(w.category == category) {
                        word.name = name;
                        word.type = 'current';
                        word.id = w.id;
                        break;
                    } else if(w.category != 'COMMON' && w.category != 'IGNORE') {
                        word.name = name;
                        word.type = 'other';
                        word.id = w.id;
                        break;
                    }
                }
            }
            if(!!word.name) {
                words.push({'name' : tmpNovel, 'key' : id});
                id += 1;
                word.key = id;
                words.push(word);
                id += 1;
                tmpNovel = ch;
                name = '';
                continue;
            }
            tmpNovel += name;
            tmpNovel += ch;
            if(ch == '\n') {
                tmpNovel += '\n';
            }
            name = '';
        }
        if(tmpNovel.length > 0) {
            words.push({'name' : tmpNovel, 'key' : id});
        }
        state.novel = tmpNovel;
        state.words = words;
        state.show = false;
        this.setState(state);
    }
    selectOption(option) {
        this.props.dispatch(categoryActions.set(option));
        Cookies.set('read_option', option);
        this.changeWords(option);
    }
    render() {
        return (
            <div>
                <div className='panel panel-info'>
                    <div className='panel-body'>
                        <div className='article-area'>
                            {/* <textarea className='angel-textarea' value={this.state.article} onChange={this.splitArticle} id='article'></textarea> */}
                            <Article {...this.state} handleClick={this.handleClick} hidePopover={this.hidePopover}/>
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