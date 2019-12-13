require('dragonli-node-tools');


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

    join: ()=>(async function (list, leftKey, newField, dbName,table, rightKey, dir = 'left', autoCloneRight = true)
    {
        var leftKeyValues = list.map(v=>v[leftKey]).filter(v=>v);
        leftKeyValues = [...new Set(leftKeyValues)];
        list.forEach(v=>v[newField]=null);
        if(leftKeyValues.length === 0)return list;
        var otherList = await this.multiGet(dbName,table,leftKeyValues);
        list.joinList(otherList,leftKey,rightKey,newField,dir,autoCloneRight);
        return list;
    }),
    leftJoin: ()=>(function (list, leftKey, newField,dbName, table, rightKey,autoCloneRight=true) {
        return this.join(list, leftKey, newField, dbName,table, rightKey,'left',autoCloneRight);
    }),
    rightJoin: ()=>(function (list, leftKey, newField,dbName, table, rightKey,autoCloneRight=true) {
        return this.join(list, leftKey, newField, dbName,table, rightKey,'right',autoCloneRight);
    }),
    page: ()=>(async function (size, page, table, where, where1, limitParas, ...paras) {
        (!page || page <= 0) && (page = 1);
        let count = await this.dbService.count( this.firDbName, table, where, limitParas, ...paras) || 0;
        // console.log('count',count);
        let pages = Math.ceil(count / size);
        let sizeEnd = size;
        let sizeStart = size * (page - 1);
        let sql = where + where1 + ' limit ?,? ';
        limitParas.push(sizeStart) && limitParas.push(sizeEnd);
        // paras.push(limitParas)
        let list = await this.dbService.list( this.firDbName, table, sql, limitParas, ...paras) || [];
        let result = {pages, count, size, page};
        result.arr = list;
        result.page_length = sizeEnd;
        return result;
    }),
}


