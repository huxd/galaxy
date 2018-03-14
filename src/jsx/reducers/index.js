import { combineReducers } from 'redux'

const initialState = {
    wordModal : {
        show : false,
        word : {
            name : '',
            example : '',
            meaning : '',
            meanings : [],
            lettertype : '[]',
            variant : '{}',
            family : ''
        }
    },

    /*记录选项信息*/
    categoryInfo : {
        categorys : [],
        category : ""
    },

    /*单词以及该单词的各种变形对单词信息的映射*/
    wordsMap : new Map(),

    /**/
    cocaMap : new Map(),

    /*显示的单词*/
    words : [],

    /*单词源对相同源单词信息的映射*/
    originMap : {},
    
    /*同义词对单词信息的映射*/
    familyMap : {}
}
function wordsRuducer(state = initialState.words, action) {
    switch (action.type) {
        case 'INIT_WORDS':
            return action.words;
        case 'REMOVE_WORD':
            return state;
        default:
            return state;
    }
}
function cocaMapRudcer(state = initialState.cocaMap, action) {
    switch (action.type) {
        case 'INIT_COCAMAP':
            return action.cocaMap;
        default:
            return state;
    }
}
function familyMapReducer(state = initialState.familyMap, action) {
    switch (action.type) {
        case 'INIT_FAMILYMAP':
            let familyMap = {};
            for(let word of action.words) {
                if(!word.family)
                    continue;
                let familys = word.family.split(':');
                for(let family of familys) {
                    if(!!familyMap[family])
                        familyMap[family].push(word);
                    else
                        familyMap[family] = [word];
                }
            }
            return familyMap;
        default:
            return state;
    }
}
function wordModalRudcer(state = initialState.wordModal, action) {
    switch (action.type) {
        case 'DISPLAY_WORD':
            return Object.assign({},state,{show:true,word:action.word});
        case 'HIDE_WORD_MODAL':
            return Object.assign({},state,{show:false});
        default:
            return state;
    }
}
function categoryReducer(state = initialState.categoryInfo, action) {
    switch (action.type) {
        case 'INIT_CATEGORY':
            if(action.categorys.length >= 1)
                state.category = action.categorys[0].name;
            state.categorys = action.categorys;
            return state;
        case 'ADD_CATEGORY':
            state = _.clone(state, true);
            state.categorys.push(action.category);
            return state;
        case 'SET_CATEGORY':
            state = _.clone(state, true);
            state.category = action.category;
            return state;
        default:
            return state;
    }
}
function wordsMapReducer(state = initialState.wordsMap, action) {
    switch (action.type) {
        case 'INIT_WORDSMAP':
            let wordsMap = new Map();
            //TODO：会有重复值
            for(let word of action.words) {
                let variant = JSON.parse(word.variant);
                variant['origin'] = word.name;
                for(let key in variant) {
                    if(!wordsMap.has(variant[key])) { 
                        wordsMap.set(variant[key], [word]);
                    } else {
                        for(let w of wordsMap.get(variant[key])) {
                            if(w.id != word.id) {
                                wordsMap.get(variant[key]).push(word);
                            }
                        }
                    }
                }
            }
            return wordsMap;
        case 'ADD_WORDSMAP':
            wordsMap = _.clone(state);
            let has = false;
            let variant = JSON.parse(action.word.variant);
            if(!wordsMap[action.word.name])
                wordsMap[action.word.name] = [];
            else {
                for(let w of wordsMap[action.word.name]) {
                    if(w.category == Cookie.get('category')) {
                        has = true;
                        break;
                    }
                }
            }

            //defect!
            if(!has) {
                wordsMap[action.word.name].push(action.word);
                for(let key in variant) {
                    if(!wordsMap[variant[key]])
                        wordsMap[variant[key]] = [];
                    wordsMap[variant[key]].push(action.word);
                }
            }
            return wordsMap;
        default:
            return state;
    }
}
function originMapReducer(state = initialState.originMap, action) {
    switch (action.type) {
        case "INIT_ORIGINMAP":
            return action.originMap;
        default:
            return state;
    }
}

export const reducers = combineReducers({
    wordModal : wordModalRudcer,
    categoryInfo : categoryReducer,
    wordsMap : wordsMapReducer,
    familyMap : familyMapReducer,
    words : wordsRuducer,
    originMap : originMapReducer,
    cocaMap : cocaMapRudcer
});