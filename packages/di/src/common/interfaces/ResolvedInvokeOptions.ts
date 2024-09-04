import type {Provider} from "../domain/Provider.js";
import type {ProviderScope} from "../domain/ProviderScope.js";
import type {TokenProvider} from "./TokenProvider.js";

export interface ResolvedInvokeOptions {
  token: TokenProvider;
  parent?: TokenProvider;
  scope: ProviderScope;
  deps: TokenProvider[];
  imports: (TokenProvider | [TokenProvider])[];
  provider: Provider;

  construct(deps: TokenProvider[]): any;
}
