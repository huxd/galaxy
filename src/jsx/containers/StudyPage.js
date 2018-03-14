import React from 'react';
import { Modal,Table } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';

import { categoryActions,wordsMapActions,originMapActions,familyMapActions,cocaMapActions } from '../actions';
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
    let reviewWords = [];
    let num = 0;
    for(let word of words) {
        if(word.meanings.length >= 1) {
            num++;
            let ra = Math.random();
            if(word.rank <= 4000 && ra <= 0.1) {
                reviewWords.push(word.id);
            } else if(word.rank <= 10000 && ra <= 0.08) {
                reviewWords.push(word.id);
            } else if(word.rank <= 20000 && ra <= 0.04) {
                reviewWords.push(word.id);
            } else if(word.rank > 20000 && ra <= 0.02) {
                reviewWords.push(word.id);
            }
        }
    }
    console.log(reviewWords.length / num);
    console.log(reviewWords.length);
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

                let originMap = {}; 
                for(let word of data.words) {
                    if(!originMap[word.origin])
                        originMap[word.origin] = [word];
                    else
                        originMap[word.origin].push(word);
                }
                this.props.dispatch(originMapActions.init(originMap));

                let cocaMap = new Map();
                for(let word of data.cocaWords) {
                    if(!cocaMap.has(word.name))
                        cocaMap.set(word.name, word.rank);
                }
                this.props.dispatch(cocaMapActions.init(cocaMap));

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
                    let variant = JSON.parse(word.variant);
                    variant['origin'] = word.name;
                    word.rank = 100000;
                    for(let key in variant) {
                        if(cocaMap.has(variant[key]) && cocaMap.get(variant[key]) < word.rank)
                            word.rank = cocaMap.get(variant[key]);
                    }
                }
                let reviewWords = getReviewWords(data.words);
                for(let word of data.words) {
                    if(reviewWords.indexOf(word.id) != -1) {
                        word.review = true;
                    }
                }
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
                for(let meaning of word.meanings) {
                    if(meaning.category == category && !wordsInfo[word.name]) {
                        wordsInfo[word.name] = word;
                        usefulWords.push(word.name);
                        break;
                    }
                }
            }
        }
        usefulWords.sort();
        var words = {
            'High Frequency' : [],
            'Medium Frequency' : [],
            'Low Frequency' : [],
            'Tiny Frequency' : []
        };

        for(let word of usefulWords) {
            var letter = word[0].toUpperCase();
            if(wordsInfo[word].rank <= 4000) {
                words['High Frequency'].push(wordsInfo[word]);
            } else if(wordsInfo[word].rank <= 10000) {
                words['Medium Frequency'].push(wordsInfo[word]);
            } else if(wordsInfo[word].rank <= 20000) {
                words['Low Frequency'].push(wordsInfo[word]);
            } else {
                words['Tiny Frequency'].push(wordsInfo[word]);
            }
            /*
            if(!!words[letter]) {
                words[letter].push(wordsInfo[word]);
            } else {
                words[letter] = [wordsInfo[word]];
            }
            */
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