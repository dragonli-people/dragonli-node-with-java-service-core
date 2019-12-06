

module.exports = class  {

    constructor(messageBodyTag='MESSAGE_BODY',authTag='auth',userTag='user'){
        this.messageBodyTag = messageBodyTag;
        this.authTag = authTag;
        this.userTag = userTag;
    }

    beforeBodyWrite(result,controller, request, response,context,controllerIocKeys,config,app){
        if(config.template)return result;
        var r = {};
        r[this.messageBodyTag] = result;
        r[this.authTag] = context.auth;
        r[this.userTag] = context.user;
        return r;
    }


}