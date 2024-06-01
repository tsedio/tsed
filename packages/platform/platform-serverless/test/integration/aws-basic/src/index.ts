import {PlatformServerless} from "@tsed/platform-serverless";
import {TimeslotsLambda} from "./TimeslotsLambda.js";

const platform = PlatformServerless.bootstrap({
  lambda: [TimeslotsLambda]
});

const callbacks = platform.callbacks();
callbacks.handler = platform.handler();
export = callbacks;
