const {ExceptoinWithErrorCode} = require('dragonli-node-service-core')
function send(response,data,template){
    template ?
        response.render(template, data)
        : response.send(data);
}

module.exports = class  {

    constructor(errorHtmlTemplet,errCodeTag='errCode',errMessageTag='message',errTag='exception',authTag='auth',userTag='user'){
        this.errorHtmlTemplet = errorHtmlTemplet;
        this.errCodeTag = errCodeTag;
        this.errMessageTag = errMessageTag;
        this.errTag = errTag;
        this.authTag = authTag;
        this.userTag = userTag;
    }

    exception(e,controller, request, response,context,config,app){
        var template = config.template ? this.errorHtmlTemplet : null;
        var r = {};
        r[this.errMessageTag] = e.message;
        r[this.errTag] = e;
        r[this.authTag] = context.auth;
        r[this.userTag] = context.user;
        e instanceof ExceptoinWithErrorCode && ( r[this.errCodeTag] = e.errCode );
        send( response, r,template);
    }


}