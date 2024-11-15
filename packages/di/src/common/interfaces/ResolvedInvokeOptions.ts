import type {LocalsContainer} from "../domain/LocalsContainer.js";
import type {Provider} from "../domain/Provider.js";
import type {TokenProvider} from "./TokenProvider.js";

export interface ResolvedInvokeOptions {
  token: TokenProvider;
  parent?: TokenProvider;
  deps: TokenProvider[];
  imports: (TokenProvider | [TokenProvider])[];
  provider: Provider;
  locals: LocalsContainer;

  construct(deps: TokenProvider[]): any;
}
