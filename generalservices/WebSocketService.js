module.exports = {
    defaultInterfaceName: 'org.dragonli.service.general.interfaces.general.WebSocketService',
    sendTextMessage: (uniqueId, content)=>({parasType:['string','string'],resultType:'boolean'}),
    recommendServer: ()=>({parasType:[],resultType:'string'}),
    recommendServerForUUid: (uuid)=>({parasType:['string'],resultType:'object'}),
    sendTextMessageByUniqueId: (uniqueId,data,key=null)=>({parasType:['string','object','string'],resultType:'boolean'}),
    updateTopicMap: (topics,uniqueId)=>({parasType:['array(string)','string'],resultType:'void'}),
    clearTopicById: (uniqueId)=>({parasType:['string'],resultType:'void'}),
    sendTextMessageByTopic: (topic,data,key)=>({parasType:['string','object','string'],resultType:'void'}),
    subscribe: (topics,uniqueId)=>({parasType:['array(string)','string'],resultType:'boolean'}),
    unsubscribe: (topic,uniqueId)=>({parasType:['string','string'],resultType:'boolean'}),
}