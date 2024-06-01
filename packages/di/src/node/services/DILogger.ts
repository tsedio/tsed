import {Logger} from "@tsed/logger";
import {InjectorService, registerProvider} from "../../common/index.js";

registerProvider({
  provide: Logger,
  deps: [InjectorService],
  useFactory(injector: InjectorService) {
    return injector.logger;
  }
});
