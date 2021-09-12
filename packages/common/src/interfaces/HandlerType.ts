/**
 * @ignore
 */
export enum HandlerType {
  CUSTOM = "custom",
  ENDPOINT = "endpoint",
  MIDDLEWARE = "middleware",
  ERR_MIDDLEWARE = "err:middleware",
  CTX_FN = "context",
  RAW_FN = "raw:middleware",
  RAW_ERR_FN = "raw:err:middleware"
}
