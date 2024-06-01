import type {TokenProvider} from "./TokenProvider.js";

export interface DIResolver {
  deps?: TokenProvider[];
  get<T = any>(type: TokenProvider, options: any): T | undefined;
}
