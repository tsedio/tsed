import {Use} from "./use";
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Head(path:string, ...args){
    return Use.apply(null, ['head', path].concat(args));
}