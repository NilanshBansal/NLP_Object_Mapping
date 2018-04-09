let source = require ('./source.json');
let part_of_speech_map= (require('./config')).map

const createTargetData = (source) =>{
    let token={};
    let targetObj={tokens:[]};
    if(source && source.type == 'RootNode' && source.children && source.children.length>0){
        source.children.forEach((paragraph)=>{
            if(paragraph.type=='ParagraphNode' && paragraph.children && paragraph.children.length>0){
                paragraph.children.forEach((sentence)=>{
                    if(sentence.type=='SentenceNode' && sentence.children && sentence.children.length>0){
                        sentence.children.forEach((word)=>{
                            let beginOffset;
                            let contentValue;
                            if(word.type=='PunctuationNode'){
                                if(word.position && word.position.start){
                                    beginOffset=word.position.start.offset
                                }
                                token={
                                    text:{
                                        content:word.value,
                                        beginOffset:beginOffset
                                    },
                                    partOfSpeech:{
                                        tag:'PUNCT'
                                    }
                                }
                                targetObj.tokens.push(token);
                            }
                            else if(word.type=='WordNode'){
                                let tagType;
                                if(word.position && word.position.start){
                                    beginOffset=word.position.start.offset
                                }
                                if(word.children && word.children[0] && word.children[0].type=='TextNode'){
                                    contentValue=word.children[0].value;
                                }
                                if(word.data ){
                                    tagType=part_of_speech_map[word.data.partOfSpeech] || "UNKNOWN"
                                }  
                                token={
                                    text:{
                                        content:contentValue,
                                        beginOffset:beginOffset
                                    },
                                    partOfSpeech:{
                                        tag:tagType
                                    }
                                    
                                }
                                targetObj.tokens.push(token);
                                
                            }
                        })
                    }
                })
            }
        })
    }
    return targetObj;
}

console.log(JSON.stringify(createTargetData(source),null,2));
