import {Strategy} from "passport";
import {Type} from "@tsed/core";

export interface ProtocolOptions<Settings = any> {
  name: string;
  useStrategy: Type<Strategy>;
  settings: Settings;
  /**
   * Run the strategy only on login endpoints decorated with `@Authenticate()`.
   *
   * A route decorated with `@Authorize()` then accepts this protocol only through the session it established,
   * and never runs the strategy itself. Use it for interactive login strategies (`passport-local`, OAuth, ...)
   * so that credentials sent to a business route do not open a new login flow.
   *
   * @default false
   */
  loginOnly?: boolean;
}
