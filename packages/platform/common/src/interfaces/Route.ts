import {TokenProvider} from "@tsed/di";
import {ControllerProvider} from "../domain/ControllerProvider";

export interface Route extends Record<string, any> {
  route: string;
  token: TokenProvider;
}

export interface RouteController {
  route: string;
  rootPath: string;
  provider: ControllerProvider;
}
