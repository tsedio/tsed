// controllers
export const CONTROLLER_URL = "tsed:controller:url";
export const CONTROLLER_DEPEDENCIES = "ted:controller:depedencies";
export const CONTROLLER_MOUNT_ENDPOINTS = "ted:controller:endpoints";
export const ENDPOINT_ARGS = "tsed:endpoint";
export const ENDPOINT_USE_BEFORE = "tsed:endpoint:before";
export const ENDPOINT_USE_AFTER = "tsed:endpoint:after";
export const RESPONSE_VIEW = "tsed:endpoint:view";
export const RESPONSE_VIEW_OPTIONS = "tsed:endpoint:view-options";

// converters
export const CONVERTER = "tsed:converter";
export const JSON_METADATA = "tsed:json:property";
export const JSON_PROPERTIES = "tsed:json:properties";

// INJECTION META TO CONTROLLER METHOD
export const INJECT_PARAMS = "tsed:inject:params";

// used to access design time types
export const DESIGN_PARAM_TYPES = "design:paramtypes";
export const DESIGN_TYPE = "design:type";
export const DESIGN_RETURN_TYPE = "design:returntype";

// export const SERVICE = "tsed:service:type";
// export const SERVICE_INSTANCE = "tsed:service:instance";

// SYMBOLS
export const EXPRESS_NEXT_FN = Symbol("next");
export const EXPRESS_ERR = Symbol("express:err");
export const EXPRESS_REQUEST = Symbol("request");
export const EXPRESS_RESPONSE = Symbol("response");
export const GET_HEADER = Symbol("getHeader");
export const PARSE_COOKIES = Symbol("parseCookies");
export const PARSE_BODY = Symbol("parseBody");
export const PARSE_QUERY = Symbol("parseQuery");
export const PARSE_PARAMS = Symbol("parseParams");
export const PARSE_SESSION = Symbol("parseSession");
export const RESPONSE_DATA = Symbol("responseData");
export const ENDPOINT_INFO = Symbol("endpointInfo");