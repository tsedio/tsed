import "./attach-logger.js";
import {EnvsConfigSource} from "@tsed/config/envs";
import {configuration} from "@tsed/di";
import {withOptions} from "@tsed/config";

configuration().set({
  extends: [
    withOptions(EnvsConfigSource, {
      name: "envs"
    })
  ]
});
