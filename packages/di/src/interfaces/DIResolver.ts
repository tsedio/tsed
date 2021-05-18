import type {TokenProvider} from "./TokenProvider";

export interface DIResolver {
  deps?: TokenProvider[];
  get<T = any>(type: TokenProvider, options: any): T | undefined;
}
