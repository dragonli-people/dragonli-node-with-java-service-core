/**
 * Created by freeangel on 17/2/16.
 */

const {WebsocketPoolFactory,sleep} = require('dragonli-node-tools');


async function InvokeSingleService( host,port,size,timeout ) {
    let started = false
    let starting = false
    const waitings = []
    const requesting = {}

    let webSocketPool = await WebsocketPoolFactory.create(onMessage,host,port,size);
    // webSocketPool.onMessage = onMessage;

    invoke.available = false
    try {
        await webSocketPool.start(host, port, size)//10是size，待读环境变量
    } catch (e) {
        throw new Error(e)
    }

    return invoke;
    async function invoke(_interface,method,group,...parameters) {
        if (parameters.length === 0 || typeof parameters[0] === 'boolean') {
            await start()
            return;
        }

        var data = {
            "interface":_interface,
            method,
            parameters,
            group,
        }

        var r = null;
        try {
            // console.info('======request data:===',data)
            r = await request(data, timeout)
        }
        catch (e) {
            //todo logs
            // console.log(data)
            console.log('======request data:===', data);
            console.log('====error!====', e);
            throw new Error(e)
        }
        return r
    }

    function request(data, timeout) {
        timeout = timeout || 20000
        var requestId = data.requestId = Math.floor(Math.random() * 1000000000)
        return new Promise((resolve, reject)=> {
            var timerId = setTimeout(()=>requestTimeout(requestId, resolve, reject, data), timeout)
            var begin = data.begin = new Date().getTime()
            requesting[requestId] = {resolve, reject, timerId, begin,requestData:data};
            webSocketPool.send(data)
        })
    }

    function requestTimeout(requestId, resolve, reject, data) {
        delete requesting[requestId];
        var cost = (new Date()).getTime() - data.begin
        reject({errMsg: `invoke time out:[${cost}]`, data})
    }

    function onMessage(data,socket) {
        data = JSON.parse(data);
        if(data.available !== undefined && !data.available)
        {
            socket.available = false// todo 有耦合性，待修改
            invoke.available = false
            return
        }
        if(data.available !== undefined && data.available)
        {
            socket.available = true// todo 有耦合性，待修改
            invoke.available = webSocketPool.all.length > 1 && webSocketPool.all.every( v=> v.available );
        }
        var record = null;
        if (data.requestId && ( record = requesting[data.requestId] )) {
            clearTimeout(record.timerId);
            delete requesting[data.requestId]
            // Logger.info(`====Invoke onMessage -- begin:${record.begin},record:${record},data:${data}====`);
            let requestData = record.requestData;
            let cost = (new Date()).getTime() - record.begin;
            // console.info(`====Invoke onMessage -- ||interface:${JSON.stringify(requestData)}`);
            data.status ? record.resolve(data.result) : record.reject({errMsg: data.errMsg, data: data})
        }
    }
}

module.exports = InvokeSingleService