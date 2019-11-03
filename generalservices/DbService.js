
module.exports = {
    defaultInterfaceName: 'org.dragonli.service.general.interfaces.general.DbService',
    get: ( dbName, table,pk)=>({parasType:['string','string','object'],resultType:'object'}),
    save: ( dbName, table,model)=>({parasType:['string','string','object'],resultType:'object'}),
    list: (dbName, table,query,paras)=>({parasType:['string','string','string','array(object)'],resultType:'array(object)'}),
    multiGet: (dbName,table,pkList)=>({parasType:['string','string','array(object)'],resultType:'array(object)'}),

    batchSave: (dbName,models,tempPkTag)=>({parasType:['string','array(object)','string'],resultType:'array(object)'}),
    batchSave: (dbName,models,tempPkTag,table)=>({parasType:['string','array(object)','string','table'],resultType:'array(object)'}),

    "delete": ( dbName, table,models)=>({parasType:['string','string','object'],resultType:'int'}),
    multiDelete: ( dbName, table,pk)=>({parasType:['string','string','array(object)'],resultType:'int'}),
    queryDelete: ( dbName, table,qeury,paras)=>({parasType:['string','string','string','array(object)'],resultType:'int'}),
    count: ( dbName, table,qeury,paras)=>({parasType:['string','string','string','array(object)'],resultType:'int'}),

    toOne: (dbName,model,mapping)=>({parasType:['string','object','object'],resultType:'object'}),
    toMany: (dbName,model,mapping)=>({parasType:['string','object','object'],resultType:'object'}),
    toMany: (dbName,modelList,mapping)=>({parasType:['string','array(object)','object'],resultType:'array(object)'}),
    toMany: (dbName,modelList,mapping,values)=>({parasType:['string','array(object)','object','object'],resultType:'array(object)'}),

    listIn: (dbName,table,field,para)=>({parasType:['string','string','string','object'],resultType:'array(object)'}),
    listIn: (dbName,table,field,para,order)=>({parasType:['string','string','string','object','string'],resultType:'array(object)'}),
    listIn: (dbName,table,field,para,order,pageSize,page)=>
        ({parasType:['string','string','string','object','string','int','int'],resultType:'array(object)'}),
    listIn: (dbName,table,fieldList,paraList)=>
        ({parasType:['string','string','array(string)','array(object)'],resultType:'array(object)'}),
    listIn: (dbName,table,fieldList,paraList,order)=>
        ({parasType:['string','string','array(string)','array(object)','string'],resultType:'array(object)'}),

    exec: (dbName,query,paras)=>({parasType:['string','string','array(object)'],resultType:'array(object)'}),
    batchUpdate: (dbName,sqls)=>({parasType:['string','array(string)'],resultType:'array(object)'}),
}

