import {Use} from "./use";
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Post(path:string, ...args){
    return Use.apply(null, ['post', path].concat(args));
}