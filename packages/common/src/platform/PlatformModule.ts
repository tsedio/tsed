import {InjectorService, Module} from "@tsed/di";
import {ConverterService} from "../mvc";
import {Platform} from "./services/Platform";

@Module({
  imports: [InjectorService, ConverterService, Platform]
})
export class PlatformModule {
  constructor(platform: Platform) {
    platform.createRoutersFromControllers();
  }
}
