import {FeatureController} from "./controllers/FeatureController.js";
import {Module} from "@tsed/di";

@Module({
  mount: {
    "/rest": [FeatureController]
  }
})
export class FeatureModule {}
