import {Use} from "./use";

/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function All(path: string, ...args: any[]): Function {
    return Use(...["all", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Get(path: string, ...args: any[]): Function {
    return Use(...["get", path].concat(args));
}
/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Post(path: string, ...args: any[]): Function {
    return Use(...["post", path].concat(args));
}
/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Put(path: string, ...args: any[]): Function {
    return Use(...["put", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Delete(path: string, ...args: any[]): Function {
    return Use(...["delete", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Head(path: string, ...args: any[]): Function {
    return Use(...["head", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Patch(path: string, ...args: any[]): Function {
    return Use(...["patch", path].concat(args));
}