export const HTTP_METHODS = [
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
  "trace",
  "unlock",
  "unsuscribe"
];

export enum OperationMethods {
  ALL = "ALL", // special key
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  HEAD = "HEAD",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  CUSTOM = "CUSTOM"
}
