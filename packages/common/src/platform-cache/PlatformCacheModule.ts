import {Module} from "@tsed/di";
import {PlatformCache} from "./services/PlatformCache";

@Module({
  imports: [PlatformCache]
})
export class PlatformCacheModule {}
