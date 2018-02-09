import {FilterPreHandlers} from "../registries/FilterRegistry";

export const PARAM_METADATA = "tsed:params:metadata";
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

/**
 * Response PreHandler
 */
FilterPreHandlers.set(EXPRESS_RESPONSE, (locals) => locals.response);
/**
 * Request PreHandler
 */
FilterPreHandlers.set(EXPRESS_REQUEST, (locals) => locals.request);
/**
 * Next PreHandler
 */
FilterPreHandlers.set(EXPRESS_NEXT_FN, (locals) => locals.next);
/**
 * Express error PreHandler
 */
FilterPreHandlers.set(EXPRESS_ERR, (locals) => locals.err);
/**
 * EndpointInfo PreHandler
 */
FilterPreHandlers.set(ENDPOINT_INFO, (locals) => {
    const op = FilterPreHandlers.get(EXPRESS_REQUEST)!;
    return op(locals).getEndpoint();
});
/**
 * ResponseData PreHandler
 */
FilterPreHandlers.set(RESPONSE_DATA, (locals) => {
    const op = FilterPreHandlers.get(EXPRESS_REQUEST)!;
    return op(locals).getStoredData();
});