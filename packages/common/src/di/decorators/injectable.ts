import {IProvider} from "../interfaces";
import {registerProvider} from "../registries/ProviderRegistry";
import {Type} from "@tsed/core";

/**
 * The decorators `@Injectable()` declare a new service can be injected in other service or controller on there `constructor`.
 * All services annotated with `@Injectable()` are constructed one time.
 *
 * > `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.
 *
 * @returns {Function}
 * @decorator
 */
export function Injectable(provider: Partial<IProvider<any>> = {}): Function {
  return (provide: Type<any>) => {
    registerProvider({
      ...provider,
      provide
    });
  };
}
