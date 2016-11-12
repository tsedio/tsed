import {Use} from "./use";

/**
 * This method is just like the router.METHOD() methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
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