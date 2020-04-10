import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {PlatformApplication} from "../../platform/services/PlatformApplication";

export function createPlatformApplication(injector: InjectorService, useClass?: Type<any>): void {
  if (useClass) {
    injector.addProvider(PlatformApplication, {
      useClass
    });

    injector.invoke(PlatformApplication);
  } else {
    injector.forkProvider(PlatformApplication);
  }
}
