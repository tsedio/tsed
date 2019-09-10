import {Use} from "./use";

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function All(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["all", path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Get(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["get", path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Post(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["post", path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Put(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["put", path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Delete(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["delete", path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Head(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["head", path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Patch(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["patch", path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Options(path: string | RegExp | any = "/", ...args: any[]): Function {
  return Use(...["options", path].concat(args));
}
