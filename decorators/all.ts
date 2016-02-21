import {Use} from "./use";
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function All(path:string, ...args){
    return Use.apply(null, ['all', path].concat(args));
}