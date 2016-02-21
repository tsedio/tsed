import {Use} from "./use";
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Put(path:string, ...args){
    return Use.apply(null, ['put', path].concat(args));
}