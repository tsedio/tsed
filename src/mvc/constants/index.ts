/**
 * @module mvc
 */ /** */

/**
 * Metadata key
 * @private
 * @type {string}
 */
export const PARAM_METADATA = "tsed:inject:params";
/**
 * Express methods
 * @private
 * @type {string}
 */
export const ENDPOINT_METHODS = [
    "all", "checkout", "connect",
    "copy", "delete", "get",
    "head", "lock", "merge",
    "mkactivity", "mkcol", "move",
    "m-search", "notify", "options",
    "param", "patch", "post",
    "propfind", "propatch", "purge",
    "put", "report", "search",
    "subscribe", "trace", "unlock",
    "unsuscribe"
];

/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_NEXT_FN = Symbol("next");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_ERR = Symbol("err");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_REQUEST = Symbol("request");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_RESPONSE = Symbol("response");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const RESPONSE_DATA = Symbol("responseData");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const ENDPOINT_INFO = Symbol("endpointInfo");
