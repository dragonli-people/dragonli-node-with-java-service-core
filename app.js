const {AppWithExpress} = require('dragonli-node-service-core');
const AppConfig = require('./appconfig/AppConfig');

class Controller1 {
    async index(){
        var redisValue = await this.redisHandler.get('/test1/test2');
        var sha1Result = await this.otherService.sha1('aaabbb');
        var user = await this.dbService.get('db1','user',1);
        var auth = await this.authService.generate('',1,'ccc');//, user.id, user.passwd);
        var recommendServer = await this.websocketService.recommendServerForUUid(user.id.toString());
        var code = Math.floor(Math.random()*1000000)%1000000;
        var lockResult1 = await this.zookeeperService.lock('lock1',code,10000);
        var lockResult2 = await this.zookeeperService.lock('lock1',code,10000);
        await this.zookeeperService.releaseLock('lock1',code);
        await this.redisHandler.set('/test1/test2','123');
        return {msg:'welcome! ',sha1Result,user,auth,recommendServer,lockResult1,lockResult2,redisValue};
    }

    // async hello(){
    //     return {num:Math.random(),time:this.lastTime,initValue:this.valueInitOnAppStart};
    // }
}

const routerConf = [
    {url:'/',clz:Controller1,method:'index'},
    // {url:'/ajax/test',clz:Controller1,method:'hello'},
];


process.env.HTTP_PORT = 3002;
process.env.ENV_SERVICE_CONFIG_URL = process.env.ENV_SERVICE_CONFIG_URL || 'http://192.168.7.109:8888/service-config/dev';
const config = new AppConfig();
config.setViewFolder('views');
config.addRoutesConfig(routerConf);

(new AppWithExpress()).start(config);
