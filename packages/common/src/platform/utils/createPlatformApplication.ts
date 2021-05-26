import {InjectorService} from "@tsed/di";
import {PlatformApplication} from "../services/PlatformApplication";

export function createPlatformApplication(injector: InjectorService): void {
  injector.forkProvider(PlatformApplication);
}
