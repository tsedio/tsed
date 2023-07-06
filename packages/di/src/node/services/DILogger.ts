import {Logger} from "@tsed/logger";
import {InjectorService, registerProvider} from "../../common/index";

registerProvider({
  provide: Logger,
  deps: [InjectorService],
  useFactory(injector: InjectorService) {
    return injector.logger;
  }
});
