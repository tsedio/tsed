// controllers
export const CONTROLLER_URL = "tsed:controller:url";
export const CONTROLLER_DEPEDENCIES = "ted:controller:depedencies";
export const ENDPOINT_ARGS = "tsed:endpoint";
export const ENDPOINT_VIEW = "tsed:endpoint:view";

// converters
export const JSON_CONVERTERS = "tsed:json:converter";
export const JSON_METADATA = "tsed:json:property";

// INJECTION META TO CONTROLLER METHOD
export const INJECT_PARAMS = "tsed:inject:params";

// stored params types for services or controllers
export const PARAM_TYPES = "tsed:paramtypes";

// used to access design time types
export const DESIGN_PARAM_TYPES = "design:paramtypes";
export const DESIGN_TYPE = "design:type";

export const SERVICE = "tsed:service:type";
export const SERVICE_INSTANCE = "tsed:service:instance";

// SYMBOLS
export const EXPRESS_NEXT_FN = Symbol("next");
export const EXPRESS_REQUEST = Symbol("request");
export const EXPRESS_RESPONSE = Symbol("response");
export const GET_HEADER = Symbol("getHeader");
export const PARSE_COOKIES = Symbol("parseCookies");
export const PARSE_BODY = Symbol("parseBody");
export const PARSE_QUERY = Symbol("parseQuery");
export const PARSE_PARAMS = Symbol("parseParams");