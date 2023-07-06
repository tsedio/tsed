import {ProviderScope} from "../domain/ProviderScope";
import {TokenProvider} from "./TokenProvider";

export interface InvokeOptions<T = any> {
  deps: any[];
  imports: any[];
  parent?: TokenProvider;
  scope: ProviderScope;
  useScope: boolean;
  rebuild?: boolean;
}
