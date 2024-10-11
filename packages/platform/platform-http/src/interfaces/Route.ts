import {Provider, TokenProvider} from "@tsed/di";

export interface Route extends Record<string, any> {
  route: string;
  token: TokenProvider;
}

export interface RouteController {
  route: string;
  routes: Set<string>;
  provider: Provider;
}
