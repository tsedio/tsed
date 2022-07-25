export enum PlatformHandlerType {
  CUSTOM = "custom",
  ENDPOINT = "endpoint",
  MIDDLEWARE = "middleware",
  ERR_MIDDLEWARE = "err:middleware",
  CTX_FN = "context",
  RESPONSE_FN = "response",
  RAW_FN = "raw:middleware",
  RAW_ERR_FN = "raw:err:middleware"
}
