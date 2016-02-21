/**
 *
 * @param params
 * @param requiredParams
 * @returns {Array}
 */
export function checkParamsRequired(params:any, requiredParams:string[]):string[]{
    var a = [];

    for (var i = 0; i < requiredParams.length; i++) {

        var key = requiredParams[i];

        if (params[key] === undefined) {
            a.push(key);
        }
    }

    return a;
}