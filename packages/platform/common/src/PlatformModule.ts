import {InjectorService, Module} from "@tsed/di";
import {ConverterService} from "./services/ConverterService";
import {Platform} from "./services/Platform";

/**
 * @ignore
 * @deprecated Will be removed in v7
 */
@Module({
  imports: [InjectorService, ConverterService, Platform]
})
export class PlatformModule {}
