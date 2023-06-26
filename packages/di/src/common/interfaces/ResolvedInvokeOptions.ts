import type {Provider} from "../domain/Provider";
import type {ProviderScope} from "../domain/ProviderScope";
import type {TokenProvider} from "./TokenProvider";

export interface ResolvedInvokeOptions {
  token: TokenProvider;
  parent?: TokenProvider;
  scope: ProviderScope;
  deps: TokenProvider[];
  imports: TokenProvider[];
  provider: Provider;

  construct(deps: TokenProvider[]): any;
}
