import {Use} from "./use";
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Delete(path:string, ...args){
    return Use.apply(null, ['delete', path].concat(args));
}