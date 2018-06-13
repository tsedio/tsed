/**
 *
 */
export interface IFilter {
  transform?(expression: string, request: Express.Request, response: Express.Response): any;
}
