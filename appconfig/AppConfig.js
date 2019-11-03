const {AppConfig,AppInitRedisHandler} = require('dragonli-node-general-service-core');
const EvnServerConfig = require('../appconfighandlers/EvnServerConfig');
const AppInitInvokerServiceHandler = require('../servicesupport/AppInitInvokerServiceHandler');
const AppInitRegistServiceHandler = require('../generalservices/AppInitRegistServiceHandler');
const AuthService = require('../generalservices/AuthService');
const DbService = require('../generalservices/DbService');
const OtherService = require('../generalservices/OtherService');
const WebSocketService = require('../generalservices/WebSocketService');
const ZookeeperService = require('../generalservices/ZookeeperService');

module.exports = class extends AppConfig {
    constructor(){
        super();
        var envServiceConfigUrl = process.env.ENV_SERVICE_CONFIG_URL || '';
        envServiceConfigUrl && this.addAppInitConfigHandlers(
            [new EvnServerConfig(envServiceConfigUrl,config=>config.propertySources[0].source)]);

        this.addAppInitHandlers([
            new AppInitRedisHandler('redisHandler','REDIS_HOST','REDIS_PORT'
                ,'service.node-service.redis-host','service.node-service.redis-port'),

            new AppInitInvokerServiceHandler('InvokeService'
                ,'INVEKE_SERVICE_CONFIG_URL','service.node-service.dubbo-consumer-proxy-address'),

            new AppInitRegistServiceHandler('authService' ,'InvokeService',AuthService),
            new AppInitRegistServiceHandler('dbService' ,'InvokeService',DbService),
            new AppInitRegistServiceHandler('otherService' ,'InvokeService',OtherService),
            new AppInitRegistServiceHandler('websocketService' ,'InvokeService',WebSocketService),
            new AppInitRegistServiceHandler('zookeeperService' ,'InvokeService',ZookeeperService),
        ]);

        this.addControllerIocKeys(['redisHandler','InvokeService'
            ,'authService','dbService','otherService','websocketService','zookeeperService']);
    }
}