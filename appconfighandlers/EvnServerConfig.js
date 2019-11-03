const {SimpleGetRequest} = require('dragonli-node-tools')
const PaserPlaceholders = require('../libs/PaserPlaceholders')
module.exports = class  {
    constructor(address,rootFun){
        this.address = address;
        this.rootFunc = rootFun;
        this.config = null;
    }

    async init(app,DATA_POOL,CONFIG_POOL){
        if(!this.address)return;
        this.config =  JSON.parse( await SimpleGetRequest.sendGet(this.address) ) ;
        this.rootFunc && ( this.config = this.rootFunc( this.config ) );

        Object.keys(this.config).forEach(key=>{
            var value = PaserPlaceholders(this.config[key],this.config);
            CONFIG_POOL[key] = value;
            console.log(` === init server config [${key}]:[${value}] === `);
        });
    }
        // configUrl && ( global.ENV_CONFIG = JSON.parse( await HttpUtil.sendGet(configUrl) ) );
        // if(global.ENV_CONFIG){
        //     //redis和微服务的地址和端口可由此处传入
        //     var config = global.ENV_CONFIG = global.ENV_CONFIG.propertySources[0].source;

}