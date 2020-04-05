export interface OnResponse {
  $onResponse(request: TsED.Request, response: TsED.Response): void;
}
