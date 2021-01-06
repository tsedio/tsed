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
