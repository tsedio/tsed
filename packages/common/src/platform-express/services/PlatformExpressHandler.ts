import {OverrideProvider} from "@tsed/di";
import {PlatformHandler} from "../../platform/services/PlatformHandler";

/**
 * @platform
 * @express
 */
@OverrideProvider(PlatformHandler)
export class PlatformExpressHandler extends PlatformHandler {}
