
module.exports = {
    defaultInterfaceName: 'org.dragonli.service.general.interfaces.general.ZookeeperService',
    lock: (str,code)=>({parasType:['string','int'],resultType:'boolean'}),
    lock: (str,code,timeout)=>({parasType:['string','int','long'],resultType:'boolean'}),
    releaseLock: (str,code)=>({parasType:['string','int'],resultType:'void'}),

}

