let source = require('./source.json');
let part_of_speech_map = (require('./config')).part_of_speech_map
let text=(require('./config')).text

const getPunctuationNode = word => {
    let beginOffset;
    if (word.position && word.position.start) {
        beginOffset = word.position.start.offset
    }
    let token = {
        text: {
            content: word.value,
            beginOffset: beginOffset
        },
        partOfSpeech: {
            tag: 'PUNCT'
        }
    }
    return token;
}

const getWordNode = word => {
    let tagType;
    let beginOffset;
    let contentValue;
    let wordObj={token:{},entity:{}};
    if (word.position && word.position.start) {
        beginOffset = word.position.start.offset
    }
    if (word.children && word.children[0] && word.children[0].type === 'TextNode') {
        contentValue = word.children[0].value;
    }
    if (word.data) {
        tagType = part_of_speech_map[word.data.partOfSpeech] || "UNKNOWN"
        if(tagType==="NOUN"){
            wordObj.entity=getEntities(word,beginOffset,contentValue);
        }
    }
    wordObj.token = {
        text: {
            content: contentValue,
            beginOffset: beginOffset
        },
        partOfSpeech: {
            tag: tagType
        }
    }
    return wordObj;
}

const getEntities = (word,beginOffset,contentValue)=>{
    let type="COMMON";
    if(word.data.partOfSpeech === "NNP" || word.data.partOfSpeech === "NNPS"){
        type="PROPER";
    }
    
    let entity={
        type:"OTHER",
        metadata:{},
        salience:0,
        sentiment:{magnitude:0,score:0},
        name:contentValue,
        mentions:[
            {
                text:{
                    content:contentValue,
                    beginOffset:beginOffset
                },
                sentiment:{
                    magnitude:0,
                    score:0
                },
                type:type
            }
        ]
    };
    return entity;
}

const getSentences = (sentence) =>{
    let beginOffset;
    let endOffset;
    if(sentence.position && sentence.position.start && sentence.position.end){
        beginOffset=sentence.position.start.offset;
        endOffset=sentence.position.end.offset;
    }
    let sentenceObj={
        text:{
            content:text.substring(beginOffset,endOffset),
            beginOffset:beginOffset
        },
        sentiment:{
            magnitude:0,
            score:0
        }
    };
    return sentenceObj;
}

const createTargetData = (source) => {
    let wordObj={};
    let targetObj = { tokens: [] , entities:[],sentences:[]};
    if (source && source.type === 'RootNode' && source.children && source.children.length) {
        source.children.forEach((paragraph) => {
            if (paragraph.type === 'ParagraphNode' && paragraph.children && paragraph.children.length ) {
                paragraph.children.forEach((sentence) => {
                    if (sentence.type === 'SentenceNode' && sentence.children && sentence.children.length) {
                        targetObj.sentences.push(getSentences(sentence));
                        sentence.children.forEach((word) => {
                            if (word.type === 'PunctuationNode') {
                                targetObj.tokens.push(getPunctuationNode(word));
                            }
                            else if (word.type === 'WordNode') {
                                wordObj=getWordNode(word);
                                targetObj.tokens.push(wordObj.token);
                                if((Object.keys(wordObj.entity).length) > 0){
                                    targetObj.entities.push(wordObj.entity);
                                }
                            }
                        })
                    }
                })
            }
        })
    }
    return targetObj;
}

console.log(JSON.stringify(createTargetData(source), null, 2));
