export enum ParamTypes {
  $CTX = "$CTX",
  BODY = "BODY",
  PATH = "PATH",
  QUERY = "QUERY",
  HEADER = "HEADER",
  RAW_BODY = "RAW_BODY",
  COOKIES = "COOKIES",
  LOCALS = "LOCALS",
  SESSION = "SESSION",
  FILES = "FILES",

  /// NOT STD
  NEXT_FN = "NEXT_FN",
  ERR = "ERR",
  REQUEST = "REQUEST",
  PLATFORM_REQUEST = "PLATFORM_REQUEST",
  NODE_REQUEST = "NODE_REQUEST",
  RESPONSE = "RESPONSE",
  PLATFORM_RESPONSE = "PLATFORM_RESPONSE",
  NODE_RESPONSE = "NODE_RESPONSE",
  RESPONSE_DATA = "RESPONSE_DATA",
  ENDPOINT_INFO = "ENDPOINT_INFO",
  RES = "RES",
  REQ = "REQ"
}

export const PARAM_TYPES_DATA_PATH: Record<string, string> = {
  [ParamTypes.HEADER]: "$ctx.request.headers",
  [ParamTypes.RAW_BODY]: "$ctx.request.rawBody",
  [ParamTypes.BODY]: "$ctx.request.body",
  [ParamTypes.QUERY]: "$ctx.request.query",
  [ParamTypes.PATH]: "$ctx.request.params",
  [ParamTypes.COOKIES]: "$ctx.request.cookies",
  [ParamTypes.SESSION]: "$ctx.request.session",
  [ParamTypes.LOCALS]: "$ctx.response.locals"
};
