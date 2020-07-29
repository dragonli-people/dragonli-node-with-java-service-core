// function createSetUserRoleFunc(authService,context,pkField='id',codeFilter=null){
//     return async function (user,...handlers) {
//         // user && codeFilter && console.log('codeFilter',codeFilter(user));
//         context.user = this.user = user;
//         context.auth = this.auth = user ?
//             await authService.generate('',user[pkField],codeFilter ? codeFilter(user) || '':'')
//             : await authService.generate('',0,'');
//     }
// }
const {ExceptoinWithErrorCode} = require('dragonli-node-service-core');

function createUserRoleFunc(app,DATA_POOL,CONFIG_POOL,roleFilterVarName,func,...varNames){
    var handlers = varNames.map(name=>DATA_POOL[name]);
    var [roleFilter] = roleFilterVarName
            && app.config.controllerFilterHandlers.filter(v=>v.HANDLER_KEY === roleFilterVarName) || [];
    roleFilter || ( [roleFilter] = app.config.controllerFilterHandlers.filter(v=>v instanceof RoleFilter) || [] );
    if(!roleFilter) throw new Error('cant find roleFilter');
    varNames = roleFilterVarName = DATA_POOL = null;
    roleFilter.findRoleFunc = function (user,guestRoleName,generalUserRoleName){
        return func( user,guestRoleName,generalUserRoleName,...handlers);//.get('db1','user',uid);

    }
};



class RoleFilter{

    constructor(handlerKey,guestRoleName='GUEST',generalUserRoleName='USER',errCode=0,findRoleFunc=null){
        this.HANDLER_KEY = handlerKey;
        this.guestRoleName = guestRoleName;
        this.generalUserRoleName = generalUserRoleName;
        this.errCode = errCode;
        this.findRoleFunc = findRoleFunc || ( (user,guestRoleName,generalUserRoleName)=>
            user ? new Set([generalUserRoleName]) : new Set([guestRoleName]) );
    }

    async doFilter (controller,context,controllerIocKeys, request, response, config, app) {
        var allowRoles = typeof config.roles === 'string' ? config.roles.split(',') : config.roles;
        if( !Array.isArray( allowRoles ) || allowRoles.length === 0)return true;
        if( !this.findRoleFunc )return true;
        var user = context.user;
        var userRoleSet = await this.findRoleFunc(user,this.guestRoleName,this.generalUserRoleName);
        var f = allowRoles.some(role=>userRoleSet.has(role));
        if(!f)console.error('role Permission denied ! need one of role in :'+allowRoles.join(','))
        if(!this.errCode)return f;
        if(!f)throw new ExceptoinWithErrorCode(this.errCode,'role Permission denied ! need one of role in :'+allowRoles.join(','));
        return true;
    }
}

RoleFilter.createUserRoleFunc = createUserRoleFunc;
// RoleFilter.createAndSetFindRoleFunc = (handlerName, authReadFilterVarName, func,app,DATA_POOL,CONFIG_POOL)=>
//     createFindUserFunc(handlerName, roleFilterVarName, func)(app,DATA_POOL,CONFIG_POOL);
module.exports = RoleFilter;