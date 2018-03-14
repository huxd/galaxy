import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Wordspanels from '../components/Wordspanels';

var splitArticleToSentence = function(article) {
    let stopWords = ['.', '!', '?', ';'];
    let sentences = [];
    let left = 0;
    for(let i = 0; i < article.length; i++) {
        if(stopWords.indexOf(article[i]) < 0) {
            if(i != article.length - 1) {
                continue;
            }
        }
        if(i == left) {
            left++;
            continue;
        }
        sentences.push(article.substring(left, i + 1));
        left = i + 1;
    }
    //console.log(sentences);
    return sentences;
}

var splitArticle = function(article, category, wordsMap, cocaMap) {
    article = article.replace(/((Mr)|(Mrs)|(St))\./g,'$1,');
    //article = article.replace(/\.{3}/g,',,,');
    let sentences = splitArticleToSentence(article);
    let wordsInfo = {};
    let usefulWords = [];
    for(let i in sentences) {
        let sentence = sentences[i].replace(/((Mr)|(Mrs)|(St)),/g,'$1.');
        //sentence = sentence.replace(/,,,/g,'...');
        sentence = sentence.replace(/‘|’/g,'\'');
        sentence = sentence.trim();
        let name = '';
        for (let i in sentence) {
            let ch = sentence[i];
            if((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
                name += ch;
                if(i != sentence.length - 1) {
                    continue;
                }
            }
            if(!name || /[0-9]+/.test(name))
                continue;
            name = name.toLowerCase();
            if(wordsMap.has(name)) {
                name = wordsMap.get(name)[0].name;
            }
            let word = wordsInfo[name];
            let rank = 100000;
            if(cocaMap.has(name)) {
                rank = cocaMap.get(name);
            }
            if(!!word) {
                word.count++;
                word.meanings[0].example += '\n';
                word.meanings[0].example += sentence;
                if(rank < word.rank) {
                    word.rank = rank;
                }
                name = '';
                continue;
            }
            word = {
                count : 1,
                example : sentence,
                name : name,
                rank : rank,
                meanings : [{
                    id : name + "1",
                    example : sentence,
                    meaning : ''
                }],
                lettertype : '[]',
                variant : '{}'
            };
            wordsInfo[name] = word;
            if(!wordsMap.has(name)) {
                usefulWords.push(word);
            }
            else if(category != 'COMMON' && category != 'IGNORE') {
                let has = true;
                for(let w of wordsMap.get(name)) {
                    if(w.category == 'COMMON' || w.category == 'IGNORE') {
                        has = true;
                    } else if(w.category == category) {
                        has = false;
                    }
                    for(let meaning of w.meanings) {
                        if(meaning.category == category) {
                            has = false;
                            break;
                        }
                    }
                    if(!has) {
                        usefulWords.push(word);
                        break;
                    }
                }
            }
            name = '';
        }
    }
    return usefulWords;
}

var letterToWordMap = function(usefulWords) {
    let words = {};
    let i = 0;
    let all = 0;
    let wordNum = 0;
    let ratioMap = [];
    for(let i = 1; i <= 20; i++)
        ratioMap[i] = 0;
    let num = 0;
    for(let word of usefulWords) {
        let letter = word.name[0].toUpperCase();
        let count = word.count;
        if(count != num) {
            num = count;
            //console.log("<<< " + num + " >>>\n");
        }
        if(count >= 6) {
            //console.log(word.name);
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
        if(count <= 20 && count >= 6) {
            all += count;
            wordNum += 1;
        }
        i++;
    }
    console.log("<<< coca20000 >>>");
    for(let word of usefulWords) {
        if(word.rank < 100000 && word.count >= 6) {
            console.log(word.name);
        }
    }
    console.log("<<< other >>>");
    for(let word of usefulWords) {
        if(word.rank == 100000 && word.count >= 6) {
            console.log(word.name);
        }
    }
    console.log(wordNum);
    console.log("average : " + all / wordNum);
    /*
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
    */
    
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
        let usefulWords = splitArticle(article, category, this.props.wordsMap, this.props.cocaMap);
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
        wordsMap : state.wordsMap,
        cocaMap : state.cocaMap
    }
})(Panel);