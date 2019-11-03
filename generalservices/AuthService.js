
module.exports = {
    defaultInterfaceName: 'org.dragonli.service.general.interfaces.general.AuthService',
    validateAndRefresh: (authDto, refreshTime, autoGenerate) => ({
        parasType: ['object', 'boolean', 'boolean'],
        resultType: 'object'
    }),
    validateAndRefresh: (authDto, refreshTime, autoGenerate, privateKey, timeout) =>
        ({parasType: ['object', 'boolean', 'boolean', 'string', 'long'], resultType: 'object'}),
    generate: (uniqueId, uid, code) => ({parasType: ['string', 'long', 'string'], resultType: 'object'}),
    generate: (uniqueId, uid, code, privateKey) => ({
        parasType: ['string', 'long', 'string', 'string'],
        resultType: 'object'
    }),

    signOrigin: (uniqueId, uid, code, time) => ({
        parasType: ['string', 'long', 'string', 'long'],
        resultType: 'string'
    }),
    signOrigin: (uniqueId, uid, code, time, privateKey) =>
        ({parasType: ['string', 'long', 'string', 'long', 'string'], resultType: 'string'}),
    generateUniqueId: (uid) => ({parasType: ['long'], resultType: 'string'}),
}

