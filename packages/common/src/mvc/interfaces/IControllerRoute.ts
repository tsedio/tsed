/**
 *
 */
export interface IControllerRoute {
  method: string;
  name: string;
  url: string;
  className: string;
  methodClassName: string;
  parameters: any;
  returnType?: any;
}
