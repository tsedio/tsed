import {Module} from "@tsed/di";
import {PlatformCache} from "./services/PlatformCache";

/**
 * @ignore
 */
@Module({
  imports: [PlatformCache]
})
export class PlatformCacheModule {}
