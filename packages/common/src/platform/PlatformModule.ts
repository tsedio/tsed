import {InjectorService, Module} from "@tsed/di";
import {MvcModule} from "../mvc";
import {Platform} from "./services/Platform";
import {RouteService} from "./services/RouteService";

@Module({
  imports: [InjectorService, MvcModule, Platform, RouteService]
})
export class PlatformModule {
  constructor(platform: Platform) {
    platform.createRoutersFromControllers();
  }
}
