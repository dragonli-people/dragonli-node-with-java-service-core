const {AppWithExpress,ExceptoinWithErrorCode} = require('dragonli-node-service-core');
const {AppInitMysqlHandler} = require('dragonli-node-general-service-core')
const AppConfig = require('./appconfig/AppConfig');
const AuthReadFilter = require('./filters/AuthReadFilter')
const RoleFilter = require('./filters/RoleFilter')

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

    async viewUser(){
        return {user:this.user};
    }

    async clearUser(){
        this.setUser && await this.setUser(null);
        return {}
    }

    async testSetUser(){
        var user = await this.dbService.get('db1','user',1);
        this.setUser && await this.setUser(user);
        return {message:'ok'};
    }

    async errWithCode(){
        console.log('paras:',this.paras);
        this.assert(this.paras.ok,1024,'1024 error...');
        return {ok:this.paras.ok};
        // throw new ExceptoinWithErrorCode(1024,'1024 error');
    }

    async generalError(){
        var a = null;
        a.doSth();
        return {};
    }

    async testRole(){
        return {message: 'ok'};
    }

    async join1(){
        var list = await this.dbService.list('db2','message','',[]);
        list = await this.dbService.leftJoin(list, 'user_id', 'user','db1', 'user', 'id');
        return {list};
    }

    async join2(){
        var list = await this.db2Handler.query('select * from message order by id');
        list = await this.db1Handler.leftJoin(list, 'user_id', 'user', 'user', 'id');
        return {list};
    }
}

const routerConf = [
    {url:'/',clz:Controller1,method:'index'},
    {url:'/viewUser',clz:Controller1,method:'viewUser'},
    {url:'/clearUser',clz:Controller1,method:'clearUser'},
    {url:'/testSetUser',clz:Controller1,method:'testSetUser'},
    {url:'/errWithCode',clz:Controller1,method:'errWithCode'},
    {url:'/generalError',clz:Controller1,method:'generalError'},
    {url:'/testRole',clz:Controller1,method:'testRole',roles:'ADMIN'},
    {url:'/join1',clz:Controller1,method:'join1'},
    {url:'/join2',clz:Controller1,method:'join2'},
];

process.env.HTTP_PORT = 3002;
process.env.ENV_SERVICE_CONFIG_URL = process.env.ENV_SERVICE_CONFIG_URL || 'http://192.168.7.109:8888/service-config/dev';
const config = new AppConfig();
config.setViewFolder('views');
config.addRoutesConfig(routerConf);
config.addAppInitHandlers([
    new AppInitMysqlHandler('db1Handler','data-source-configs.db1.data-config.jdbc-url'
        ,'data-source-configs.db1.data-config.username','data-source-configs.db1.data-config.password'),
    new AppInitMysqlHandler('db2Handler','data-source-configs.db2.data-config.jdbc-url'
        ,'data-source-configs.db2.data-config.username','data-source-configs.db2.data-config.password'),
]);
config.addControllerFilterHandlers([
    new AuthReadFilter('authReader','authService','id',null,
        ['dbService',async (uid,auth,h)=>await h.getOne('db1','user',uid)]),
    new RoleFilter('roleFilter','GUEST','USER',0),
]);

config.addControllerIocKeys(['db1Handler','db2Handler']);

config.appBeforeStartReady = (app,DATA_POOL,CONFIG_POOL)=> {}
/*
// or simple ( there is only one thing in appBeforeStartReady ) :
config.appBeforeStartReady = AuthReadFilter.createFindUserFunc(
    'dbService','authReader',(dbService,uid,auth)=>dbService.get('db1','user',uid));
}
*/

//you can rewrite these two items below
// config.setControllerResultAdvice([new GeneralResultFormatAdvice()]);
// config.setControllerErrorAdvice(new GeneralErrorAdvice( 'err.ejs'));

(new AppWithExpress()).start(config);
