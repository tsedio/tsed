export interface OnRequest {
  $onResponse(request: TsED.Request, response: TsED.Response): void;
}
