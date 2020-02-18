"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const use_1 = require("./use");
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
function All(path = "/", ...args) {
    return use_1.Use(...["all", path].concat(args));
}
exports.All = All;
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
function Get(path = "/", ...args) {
    return use_1.Use(...["get", path].concat(args));
}
exports.Get = Get;
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
function Post(path = "/", ...args) {
    return use_1.Use(...["post", path].concat(args));
}
exports.Post = Post;
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
function Put(path = "/", ...args) {
    return use_1.Use(...["put", path].concat(args));
}
exports.Put = Put;
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
function Delete(path = "/", ...args) {
    return use_1.Use(...["delete", path].concat(args));
}
exports.Delete = Delete;
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
function Head(path = "/", ...args) {
    return use_1.Use(...["head", path].concat(args));
}
exports.Head = Head;
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
function Patch(path = "/", ...args) {
    return use_1.Use(...["patch", path].concat(args));
}
exports.Patch = Patch;
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
function Options(path = "/", ...args) {
    return use_1.Use(...["options", path].concat(args));
}
exports.Options = Options;
//# sourceMappingURL=route.js.map