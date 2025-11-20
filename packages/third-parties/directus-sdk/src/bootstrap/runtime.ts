import "./attach-logger.js";

import {withOptions} from "@tsed/config";
import {EnvsConfigSource} from "@tsed/config/envs";
import {configuration} from "@tsed/di";

configuration().set({
  extends: [
    withOptions(EnvsConfigSource, {
      name: "envs"
    })
  ]
});
