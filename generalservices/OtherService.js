
module.exports = {
    defaultInterfaceName: 'org.dragonli.service.general.interfaces.general.OtherService',
    sha1: str=>({parasType:['string'],resultType:'string'}),
    sha1: (str,len)=>({parasType:['string','int'],resultType:'string'}),
    addition: (str1,str2,scale)=>({parasType:['string','string','int'],resultType:'string'}),
    md5: str=>({parasType:['string'],resultType:'string'}),
    md5: (str,len)=>({parasType:['string','int'],resultType:'string'}),
    byteArrayToHexStr: (byteArray)=>({parasType:['buffer'],resultType:'string'}),
    toShortCryptoCode: (sourceCode,shortCodeLength)=>({parasType:['string','int'],resultType:'string'}),

}

