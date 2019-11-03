/**
 * Created by freeangel on 17/2/16.
 */

const InvokeSingleService = require('./InvokeSingleService.js');
const {sleep} = require('dragonli-node-tools');

const serviceDic = new Map()
let hadStarted = false
let starting = false
let serviceDefaultGroup = {};
const consumerDefaultGroup = 'default';
let servicePrefix = '';

/**
 *
 * @param config host1:port1:[connetct-count1]:[group1]|host2:port2:[connetct-count2]:[group2]|...
 * @returns {Promise<function(_interface, method, group, ...paras)>}
 */
async function InvokeServiceFactory(config)
{
    // console.log(parameters)
    const servicesGroups = await Promise.all( config.split('|').map( async (s,i,arrSource)=>{
        let arr = s.split(':')
        let host = arr[0]
        let port = arr[1] ? parseInt(arr[1]):80
        let max = arr[2] ? parseInt(arr[2]):5
        let group = ( arr[3] || (i+1) ) + '';
        let invokeSingleService = await InvokeSingleService(host,port,max);
        return {group,invokeSingleService};
    } ) );
    // console.log(parameters)

    return async function (_interface,method,group,...parameters){
        var serviceGroup = null;
        if( group && typeof group === 'object' ){
            group = group.group;
            serviceGroup = group.serviceGroup;
        }
        var service = serviceGroup === null ?
            servicesGroups[Math.floor( Math.random() * 1000000000 ) % servicesGroups.length ]
            : servicesGroups.filter(v=>v.group = servicesGroups)[0];
        if( !service )
            throw Error('no availables service connect')//除非配置错误，否则理论上这行不该出现
        var {invokeSingleService} = service;
        return await invokeSingleService( _interface,method,group,...parameters );
    }
}

module.exports = InvokeServiceFactory;
