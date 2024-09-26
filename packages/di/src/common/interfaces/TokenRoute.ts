import type {TokenProvider} from "./TokenProvider.js";

export interface TokenRoute {
  token: TokenProvider;
  route: string;
}
