import {Module} from "@tsed/di";

import {FeatureController} from "./controllers/FeatureController.js";

@Module({
  mount: {
    "/rest": [FeatureController]
  }
})
export class FeatureModule {}
