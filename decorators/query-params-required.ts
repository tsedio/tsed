import {ParamsRequiredFactory} from "./../lib/params-required-factory";
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function QueryParamsRequired(...paramsRequired){
    return ParamsRequiredFactory('query', paramsRequired);
}