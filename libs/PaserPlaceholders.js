function parse(content,placeholdersPool) {
    // var content = placeholdersPool[key] || '';
    if(typeof content !== 'string')return content;
    // console.log('begin parse:',content,typeof content);
    while (true){
        var reg = new RegExp('\\$\\{[^\\{\\}]+\\}');
        var [placeholder] = content.match(reg) || [null];
        if(!placeholder)return content;
        var placeholderContents = placeholder.slice(2,placeholder.length-1).split(':');
        var varName = placeholderContents.shift();
        var defaultValue = placeholderContents.join('');
        var value = process.env[varName]||placeholdersPool[varName]||defaultValue;
        value = parse(value,placeholdersPool);//if containt ${...}，replace it
        content = content.split(placeholder).join(value);
        // console.log('parse result',content);
    }
}

module.exports = parse;