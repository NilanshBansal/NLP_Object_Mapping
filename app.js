let source = require ('./source.json');
let part_of_speech_map= require('./part_of_speech_map')

const createTargetData = (source) =>{
    let eachToken={};
    let targetObj={tokens:[]};
    if(source && source.type == 'RootNode' && source.children && source.children.length>0){
        source.children.forEach((eachParagraph)=>{
            if(eachParagraph.type=='ParagraphNode' && eachParagraph.children && eachParagraph.children.length>0){
                eachParagraph.children.forEach((eachSentence)=>{
                    if(eachSentence.type=='SentenceNode' && eachSentence.children && eachSentence.children.length>0){
                        eachSentence.children.forEach((eachWord)=>{
                            let beginOffset;
                            let contentValue;
                            if(eachWord.type=='PunctuationNode'){
                                if(eachWord.position && eachWord.position.start){
                                    beginOffset=eachWord.position.start.offset
                                }
                                eachToken={
                                    text:{
                                        content:eachWord.value,
                                        beginOffset:beginOffset
                                    },
                                    partOfSpeech:{
                                        tag:'PUNCT'
                                    }
                                }
                                targetObj.tokens.push(eachToken);
                            }
                            else if(eachWord.type=='WordNode'){
                                let tagType;
                                if(eachWord.position && eachWord.position.start){
                                    beginOffset=eachWord.position.start.offset
                                }
                                if(eachWord.children && eachWord.children[0] && eachWord.children[0].type=='TextNode'){
                                    contentValue=eachWord.children[0].value;
                                }
                                if(eachWord.data && part_of_speech_map[eachWord.data.partOfSpeech]){
                                    tagType=part_of_speech_map[eachWord.data.partOfSpeech]
                                }
                                eachToken={
                                    text:{
                                        content:contentValue,
                                        beginOffset:beginOffset
                                    },
                                    partOfSpeech:{
                                        tag:tagType
                                    }
                                    
                                }
                                targetObj.tokens.push(eachToken);
                                
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
