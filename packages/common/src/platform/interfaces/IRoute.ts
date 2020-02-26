import {TokenProvider} from "@tsed/di";
import {ControllerProvider} from "../domain/ControllerProvider";

export interface IRoute {
  route: string;
  token: TokenProvider;
}

export interface IRouteController {
  route: string;
  provider: ControllerProvider;
}

export interface IRouteDetails {
  method: string;
  name: string;
  url: string;
  className: string;
  methodClassName: string;
  parameters: any;
  returnType?: any;
}
