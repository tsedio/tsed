import {PlatformServerless} from "../../../..";
import {TimeslotsLambda} from "./TimeslotsLambda.js";

const platform = PlatformServerless.bootstrap({
  lambda: [TimeslotsLambda]
});

const callbacks = platform.callbacks();
callbacks.handler = platform.handler();
export = callbacks;
