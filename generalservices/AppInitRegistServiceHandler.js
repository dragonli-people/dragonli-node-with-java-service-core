const ServiceHandlerFactory = require('./ServiceHandlerFactory')

module.exports = class  {
    constructor(varName,invokeFuncKey,serviceConfig){
        this.HANDLER_KEY = this.varName = varName;
        this.invokeFuncKey = invokeFuncKey;
        this.serviceConfig = serviceConfig;
    }

    async init(app,DATA_POOL,CONFIG_POOL){
        var invokeFunc = DATA_POOL[this.invokeFuncKey];
        if(!invokeFunc)return;
        var service = ServiceHandlerFactory(this.serviceConfig,invokeFunc);
        DATA_POOL[this.varName] = service;
        console.log( ` === service handler ${this.varName} started done === ` );
    }
}