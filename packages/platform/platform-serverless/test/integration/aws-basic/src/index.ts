import {PlatformServerless} from "@tsed/platform-serverless";
import {TimeslotsLambda} from "./TimeslotsLambda";

const platform = PlatformServerless.bootstrap({
  lambda: [TimeslotsLambda]
});

export = platform.callbacks();
