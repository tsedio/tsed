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

export const OPERATION_HTTP_VERBS = [
  OperationVerbs.ALL,
  OperationVerbs.GET,
  OperationVerbs.POST,
  OperationVerbs.PUT,
  OperationVerbs.PATCH,
  OperationVerbs.HEAD,
  OperationVerbs.DELETE,
  OperationVerbs.OPTIONS,
  OperationVerbs.TRACE,
  OperationVerbs.CUSTOM
];

export const OPERATION_WS_VERBS = [OperationVerbs.PUBLISH, OperationVerbs.SUBSCRIBE];
