import {Module} from "@tsed/di";
import {FeatureController} from "./controllers/FeatureController";

@Module({
  mount: {
    "/rest": [FeatureController]
  }
})
export class FeatureModule {}
