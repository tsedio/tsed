export interface OnResponse {
  $onResponse(request: Express.Request, response: Express.Response): void;
}
