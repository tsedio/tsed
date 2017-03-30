// ServerSettings
export const SERVER_SETTINGS = "tsed:server:settings";

// controllers
export const CONTROLLER_URL = "tsed:controller:url";
export const CONTROLLER_DEPEDENCIES = "ted:controller:dependencies";
export const CONTROLLER_SCOPE = "ted:controller:scope";
export const CONTROLLER_ROUTER_OPTIONS = "ted:controller:router:options";
export const CONTROLLER_MOUNT_ENDPOINTS = "ted:controller:endpoints";
export const ENDPOINT_USE = "tsed:endpoint:use";
export const ENDPOINT_USE_BEFORE = "tsed:endpoint:use:before";
export const ENDPOINT_USE_AFTER = "tsed:endpoint:use:after";

// converters
export const CONVERTER = "tsed:converter";
export const JSON_PROPERTIES = "tsed:json:properties";

// INJECTION META TO CONTROLLER METHOD
export const INJECT_PARAMS = "tsed:inject:params";

// used to access design time types
export const DESIGN_PARAM_TYPES = "design:paramtypes";
export const DESIGN_TYPE = "design:type";
export const DESIGN_RETURN_TYPE = "design:returntype";

// SYMBOLS
export const EXPRESS_NEXT_FN = Symbol("next");
export const EXPRESS_ERR = Symbol("err");
export const EXPRESS_REQUEST = Symbol("request");
export const EXPRESS_RESPONSE = Symbol("response");
export const GET_HEADER = Symbol("getHeader");
export const PARSE_COOKIES = Symbol("parseCookies");
export const PARSE_LOCALS = Symbol("parseLocals");
export const PARSE_BODY = Symbol("parseBody");
export const PARSE_QUERY = Symbol("parseQuery");
export const PARSE_PARAMS = Symbol("parseParams");
export const PARSE_SESSION = Symbol("parseSession");
export const MULTIPARTFILE = Symbol("multipartFile");
export const MULTIPARTFILES = Symbol("multipartFiles");
export const RESPONSE_DATA = Symbol("responseData");
export const ENDPOINT_INFO = Symbol("endpointInfo");