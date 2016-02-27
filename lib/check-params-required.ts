import {parse} from "./parse";
/**
 *
 * @param expressionList
 * @param scope
 * @returns {Array}
 */
export function checkParamsRequired(expressionList:string[], scope:any):string[]{
    var a = [];

    for (var i = 0; i < expressionList.length; i++) {

        var expression = expressionList[i];
        var value = parse(expression, scope);

        if (value === undefined) {
            a.push(expression);
        }
    }

    return a;
}