import {ParamsRequiredFactory} from "./../lib/params-required-factory";
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function BodyParamsRequired(...paramsRequired){
    return ParamsRequiredFactory('body', paramsRequired);
}