
module.exports = class  {

    constructor(handlerKey,cookiesAge=4320000){
        this.HANDLER_KEY = handlerKey;
        this.cookiesAge = cookiesAge;
    }

    async afterCompletion (controller,context,controllerIocKeys, request, response, config, app) {

        var auth = context.auth;
        if(!auth)throw new Error('auth cant be null !')
        response.cookie("auth",JSON.stringify(auth),{maxAge:Date.now()/1000+this.cookiesAge,httpOnly:true});

        return true;
    }
}

