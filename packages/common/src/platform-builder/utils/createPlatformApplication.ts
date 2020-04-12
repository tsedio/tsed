import {InjectorService} from "@tsed/di";
import {PlatformApplication} from "../../platform/services/PlatformApplication";

export function createPlatformApplication(injector: InjectorService): void {
  injector.forkProvider(PlatformApplication);
}
