import type {Options, OptionsJson, OptionsText, OptionsUrlencoded} from "body-parser";
import type {NextHandleFunction} from "connect";

export interface PlatformFulmineSettings {
  /**
   * The fulmine application to use instead of a new `fulmine()`, to pass options such as
   * `uwsOptions` for TLS.
   */
  app?: any;

  /**
   * body parser configuration, a function given here replaces the fulmine parser
   */
  bodyParser?: {
    json?: ((opts?: OptionsJson) => NextHandleFunction) | OptionsJson;
    text?: ((opts?: OptionsText) => NextHandleFunction) | OptionsText;
    raw?: ((opts?: Options) => NextHandleFunction) | Options;
    urlencoded?: ((opts?: OptionsUrlencoded) => NextHandleFunction) | OptionsUrlencoded;
  };
}
