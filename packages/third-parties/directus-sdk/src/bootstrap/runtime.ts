import "./attach-logger.js";
import {EnvsConfigSource} from "@tsed/config/envs";
import {configuration} from "@tsed/di";
import {withOptions} from "@tsed/config";

configuration().set({
  lazyProviders: true,
  extends: [
    withOptions(EnvsConfigSource, {
      name: "envs"
    })
  ]
});
