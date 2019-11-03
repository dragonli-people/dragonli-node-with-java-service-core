const InvokeServiceFactory = require('./InvokeServiceFactory');

module.exports = class  {
    constructor(varName,envKey,configKey){
        this.HANDLER_KEY = varName;
        this.varName = varName;
        this.envKey = envKey;
        this.configKey = configKey;
    }

    async init(app,DATA_POOL,CONFIG_POOL){
        var configStr = ( this.envKey && process.env[this.envKey] ) || ( this.configKey && CONFIG_POOL[this.configKey] );
        if(!configStr)return;
        var invokeFunc = await InvokeServiceFactory(configStr);
        DATA_POOL[this.varName] = invokeFunc;
        console.log(` === InvokerService Function ${this.varName} init done ===`);
    }
}