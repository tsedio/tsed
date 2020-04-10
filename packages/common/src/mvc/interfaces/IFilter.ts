/**
 * @deprecated Use pipe instead
 */
export interface IFilter {
  transform(expression: string, request: TsED.Request, response: TsED.Response): any;
}
