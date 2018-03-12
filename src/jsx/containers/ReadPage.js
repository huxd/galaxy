import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { wordModalActions,categoryActions,wordsMapActions,wordsActions } from '../actions';
import Select from '../containers/Select';

var baseUrl = '/galaxy/public';

var getWordItem = function(word, type) {

}

function Article(props) {
    let wordItems = [];
    for(let word of props.words) {
        if(!!word.type) {
            wordItems.push(<span class={word.type}><b>{word}</b></span>)
        } else {
            wordItems.push(<span>{word}</span>)
        }
    }
    return (
        <div className='article' >
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
            words : []
        };
        this.changeWords = this.changeWords.bind(this);
        this.splitArticle = this.splitArticle.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.displayMeaning = this.displayMeaning.bind(this);
    }
    componentDidMount() {
        $.get(baseUrl + '/index.php/getWordsAll',function(data) {
            if(data.status === 1) {
                this.props.dispatch(categoryActions.init(data.categorys));

                this.props.dispatch(wordsMapActions.init(data.words));
            }
        }.bind(this));
    }
    displayMeaning() {
        console.log(1);
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
        let word = '';
        let tmpNovel = '';
        for (let i in novel) {
            let ch = novel[i];
            if((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
                word += ch;
                if(i != novel.length - 1) {
                    continue;
                }
                ch = '';
            }
            let lword = word.toLowerCase();
            if (!allWordsMap.has(lword)) {
                word = '<span class="text-danger"><b>' + word + '</b></span>';
            } else if(category != 'COMMON' && category != 'IGNORE') {
                for(let w of allWordsMap.get(lword)) {
                    if(w.category == category) {
                        word = '<span onClick={this.displayMeaning} class="text-success"><b>' + word + '</b></span>';
                        break;
                    } else if(w.category != 'COMMON' && w.category != 'IGNORE') {
                        word = '<span class="text-warning"><b>' + word + '</b></span>';
                        break;
                    }
                }
            }
            tmpNovel += word;
            tmpNovel += ch;
            if(ch == '\n') {
                tmpNovel += '\n';
            }
            word = '';
        }
        state.novel = tmpNovel;
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

                            <Article {...this.state} />
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