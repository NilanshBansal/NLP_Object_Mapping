let source = require('./source.json');
let part_of_speech_map = (require('./config')).part_of_speech_map

const getPunctuationNode = word => {
    let token = {};
    let beginOffset;
    if (word.position && word.position.start) {
        beginOffset = word.position.start.offset
    }
    token = {
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
    if (word.position && word.position.start) {
        beginOffset = word.position.start.offset
    }
    if (word.children && word.children[0] && word.children[0].type == 'TextNode') {
        contentValue = word.children[0].value;
    }
    if (word.data) {
        tagType = part_of_speech_map[word.data.partOfSpeech] || "UNKNOWN"
    }
    token = {
        text: {
            content: contentValue,
            beginOffset: beginOffset
        },
        partOfSpeech: {
            tag: tagType
        }
    }
    return token;
}

const createTargetData = (source) => {
    let token = {};
    let targetObj = { tokens: [] };
    if (source && source.type == 'RootNode' && source.children && source.children.length > 0) {
        source.children.forEach((paragraph) => {
            if (paragraph.type == 'ParagraphNode' && paragraph.children && paragraph.children.length > 0) {
                paragraph.children.forEach((sentence) => {
                    if (sentence.type == 'SentenceNode' && sentence.children && sentence.children.length > 0) {
                        sentence.children.forEach((word) => {
                            if (word.type == 'PunctuationNode') {
                                targetObj.tokens.push(getPunctuationNode(word));
                            }
                            else if (word.type == 'WordNode') {
                                targetObj.tokens.push(getWordNode(word));
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
