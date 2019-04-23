export interface OnRequest {
  $onResponse(request: Express.Request, response: Express.Response): void;
}
