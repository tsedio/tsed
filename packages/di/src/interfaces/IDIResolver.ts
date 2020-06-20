import {TokenProvider} from "./TokenProvider";

export interface IDIResolver {
  deps?: TokenProvider[];
  get<T = any>(type: TokenProvider, options: any): T | undefined;
}
