var _ = require('lodash');

export function parse(expression:string, scope:any){
    var keys:string[] = expression.split('.'); //eval expression

    while((scope = scope[keys.shift()]) && keys.length){}

    return typeof scope == 'object' ? _.clone(scope) : scope;
}