
module.exports = function (config,invokerServiceFunc,group=null,customizedInterfaceName=null) {
    const _interface = customizedInterfaceName || config.defaultInterfaceName;
    const handler = {};

    var interfaceMethods = [];
    var generalMethods = [];
    var keys = Object.keys(config).filter(k=>typeof config[k] === 'function');
    keys.forEach(name=>{
        var func = config[name];
        var result = func.call(config);
        if(typeof result === 'function'){
            generalMethods.push({name,func});
            return;
        }
        interfaceMethods.push({name,func});
    });
    return execCreateHandler(invokerServiceFunc,_interface,group,interfaceMethods,generalMethods);
}

function execCreateHandler(invokerServiceFunc,_interface,_group,interfaceMethods,generalMethods) {
    var _interface;
    const handler = {get interfaceName(){return _interface},get group(){return _group}};
    interfaceMethods.forEach(obj=>{
        var {name:method} = obj;
        handler[method] = function (...paras) {
            return invokerServiceFunc(_interface,method,_group,...paras);
        };
    });
    generalMethods.forEach(obj=>{
        var {name,func} = obj;
        handler[name] = func;
    });
    // interfaceMethods.forEach(func=>);
    interfaceMethods = generalMethods = null;
    return handler;
}