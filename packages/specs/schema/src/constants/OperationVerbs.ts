import {Operation} from "../decorators/operations/operation";

export const ALLOWED_VERBS = [
  "all",
  "checkout",
  "connect",
  "copy",
  "delete",
  "get",
  "head",
  "lock",
  "merge",
  "mkactivity",
  "mkcol",
  "move",
  "m-search",
  "notify",
  "options",
  "param",
  "patch",
  "post",
  "propfind",
  "propatch",
  "purge",
  "put",
  "report",
  "search",
  "subscribe",
  "publish",
  "trace",
  "unlock",
  "unsuscribe"
];

export enum OperationVerbs {
  ALL = "ALL", // special key
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  HEAD = "HEAD",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PUBLISH = "PUBLISH",
  SUBSCRIBE = "SUBSCRIBE",
  CUSTOM = "CUSTOM"
}

/**
 * @deprecated Use OperationVerbs instead of OperationMethods
 */
export const OperationMethods = OperationVerbs;
