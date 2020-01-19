import {TokenProvider} from "./TokenProvider";

export interface IDIResolver {
  deps?: TokenProvider[];
  get<T = any>(type: TokenProvider): T | undefined;
}
