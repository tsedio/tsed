import {ProviderScope} from "../domain/ProviderScope.js";
import {TokenProvider} from "./TokenProvider.js";

export interface InvokeOptions<T = any> {
  deps: any[];
  imports: any[];
  parent?: TokenProvider;
  scope: ProviderScope;
  useScope: boolean;
  rebuild?: boolean;
}
