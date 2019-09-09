import {ProviderScope} from "./ProviderScope";
import {TokenProvider} from "./TokenProvider";

export interface IInvokeOptions<T> {
  deps: any[];
  imports: any[];
  parent?: TokenProvider;
  scope: ProviderScope;
  useScope: boolean;
  rebuild?: boolean;
}
