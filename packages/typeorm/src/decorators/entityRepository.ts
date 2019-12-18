import {applyDecorators, Type} from "@tsed/core";
import {Configuration, registerProvider} from "@tsed/di";
import {EntityRepository as TypeORMEntityRepository, getCustomRepository} from "typeorm";
import {TypeORMModule} from "../TypeORMModule";

/**
 * Declare a new typeORM EntityRepository which can injected to TsED service.
 * @param model
 * @decorator
 */
export function EntityRepository(model: any) {
  return applyDecorators(TypeORMEntityRepository(model), (target: Type<any>) => {
    registerProvider({
      provide: target,
      imports: [TypeORMModule],
      deps: [Configuration],
      useFactory(configuration: Configuration) {
        if (configuration.get("typeorm")) {
          return getCustomRepository(target);
        }

        return {};
      }
    });
  });
}
