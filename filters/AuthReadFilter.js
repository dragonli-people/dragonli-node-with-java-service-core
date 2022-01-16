
function createSetUser(authService,context,pkField='id',codeFilter=null){
    return async function (user) {
        // console.log('====user',user && user.id || null);
        // user && codeFilter && console.log('codeFilter',codeFilter(user));
        context.user = this.user = user;
        context.auth = this.auth = user ?
            await authService.generate('',user[pkField],codeFilter ? codeFilter(user) || '':'')
            : await authService.generate('','','');
        console.log('====auth context.auth',context.user,context.auth)
    }
}

class  AuthReadFilter{

    constructor(handlerKey,authServiceVarName,authTag='auth',pkField='id',codeFilter='passwd',findUserFunc=null){
        this.HANDLER_KEY = handlerKey;
        this.authServiceVarName = authServiceVarName;
        this.authTag = authTag;
        this.pkField = pkField;
        this.codeFilter = codeFilter;
        this.findUserFunc = findUserFunc;//should be such as : ['mysqlHandler',(uid,auth,mysqlHandler)=>mysqlHandler.getOne('user',uid)]
        // this.createSetUser = createSetUser;
    }

    async doFilter (controller,context,controllerIocKeys, request, response, config, app) {
        var authService = this.authServiceVarName && controller[this.authServiceVarName] || null;
        if(!authService)throw new Error('authService cant be null');
        var user = null,auth = request.cookies[this.authTag] ? JSON.parse(request.cookies[this.authTag]) : null;
        auth && ( auth = await authService.validateAndRefresh(auth,true,true));
        auth || (auth = await authService.generate('','',''));
        var codeFilter = this.codeFilter ;
        if(codeFilter && typeof codeFilter !== 'function' && typeof codeFilter !== 'string')
            throw new Error('codeFilter must be string or function');
        var codeFilterKey = codeFilter && typeof codeFilter === 'string' ? codeFilter : null;
        var codeFilterFunc = codeFilter && typeof codeFilter === 'function' ? codeFilter : null;
        var codeFilterResult = (codeFilterKey||codeFilterFunc) &&
            ( codeFilterKey ? (user=>user[codeFilterKey]) : (usere=>codeFilterFunc(user)) ) || null;
        // if auth.uid is not 0 , it mean that is a user . then validate user exsit and user code is right if need
        auth.uid && this.findUserFunc && ( user = await this.findUser(app,auth.uid,auth) );
        if( auth.uid && this.findUserFunc && !user )
            auth = await authService.generate('','','');//uid>0,need validate,but cant find user
        if( user && codeFilterResult && ( await codeFilterResult(user) !== auth.code ) ) {
            //such as auth.code === user.passwd
            auth = await authService.generate('','','');
            user = null;
        }
        context.auth = controller.auth = auth;
        context.user = controller.user = user;
        controller.getUser = ()=>context.user;
        authService && ( controller.setUser = createSetUser(authService,context,this.pkField,codeFilterResult) );
        controllerIocKeys.push('getUser','setUser','user','auth');
        return true;
    }

    async findUser(app,uid,auth){
        if(!this.findUserFunc || !Array.isArray(this.findUserFunc) )
            return null;
        var findUserParas = [...this.findUserFunc],func = findUserParas.pop();
        if(!func || typeof func !== 'function')return null;
        var handlers = findUserParas.map(k=>app.getFromPool(k));
        return await func( uid,auth,...handlers );
    }

}
//计划弃用
AuthReadFilter.createFindUserFunc = createFindUserFunc;
//计划弃用
AuthReadFilter.createAndSetFindUserFunc = (handlerName, authReadFilterVarName, func,app,DATA_POOL,CONFIG_POOL)=>
    createFindUserFunc(handlerName, authReadFilterVarName, func)(app,DATA_POOL,CONFIG_POOL);
//计划弃用
function createFindUserFunc(handlerName, authReadFilterVarName, func){
    return function (app,DATA_POOL,CONFIG_POOL){
        var dbService = DATA_POOL[handlerName];
        var [authReader] = authReadFilterVarName
        && app.config.controllerFilterHandlers.filter(v=>v.HANDLER_KEY === authReadFilterVarName) || [];
        authReader || ( [authReader] = app.config.controllerFilterHandlers.filter(v=>v instanceof AuthReadFilter) || [] );
        if(!authReader) throw new Error('cant find authReader');
        authReader.findUserFunc = function (uid, auth) {
            return func( dbService,uid,auth );//.get('db1','user',uid);
        }
        handlerName = authReadFilterVarName = app = DATA_POOL = CONFIG_POOL = null;
    }
};

module.exports = AuthReadFilter;