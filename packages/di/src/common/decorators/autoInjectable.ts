import {LocalsContainer} from "../domain/LocalsContainer.js";
import {InjectorService} from "../services/InjectorService.js";

export function AutoInjectable() {
  return <T extends {new (...args: any[]): NonNullable<unknown>}>(constr: T): T => {
    return class AutoInjectable extends constr {
      constructor(...args: any[]) {
        const locals = new LocalsContainer();
        super(...InjectorService.resolveAutoInjectableArgs(constr, locals, args));
        InjectorService.bind(this, locals);
      }
    } as unknown as T;
  };
}
