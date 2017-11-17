import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { wordModalActions } from '../actions';

var baseUrl = '/galaxy/public';

class Word extends React.Component {
    constructor(props) {
        super(props);
        this.showWordModal= this.showWordModal.bind(this);
    }
    showWordModal(event) {
        let word = this.props.word;
        if(!word.id) {
            this.props.dispatch(wordModalActions.displayWord(word));
            return;
        }
        $.get(baseUrl + '/index.php/getWordById?id=' + word.id, function(data) {
            if(data.status === 1) {
                data.word.meanings = data.meanings;
                this.props.dispatch(wordModalActions.displayWord(data.word));
            }
        }.bind(this));
    }
    render() {
        let wordClass = classNames({
            'tag' : true,
            'tag-special' : this.props.word.state == 1,
            'tag-active' : this.props.word.state != 1,
            'tag-review' : !!this.props.word.review
        });
        return  (
            <div className='word-item clearfix pull-left'>
                <div className={wordClass} id={this.props.word.name} onClick={this.showWordModal}>{this.props.word.name}</div>
            </div>
        )
    }
}

Word = connect(null)(Word);

function Wordspanel(props) {
    const wordItems = props.words.map((word) =>  {
        return <Word word={word} key={word.name}/>;
    });
    return (
        <div className='panel panel-info'>
            <div className='panel-heading'>
                {props.sign}
            </div>
            <div className='panel-body'>
                {wordItems}
            </div>
        </div>
    )
}
function Wordspanels(props) {
    const words = props.words;
    const wordspanelItems = [];
    for(let key in words) {
        wordspanelItems.push(<Wordspanel words={words[key]} sign={key} key={key}/>);
    }
    return (
        <div>
            {wordspanelItems}
        </div>
    )
}
export default Wordspanels;