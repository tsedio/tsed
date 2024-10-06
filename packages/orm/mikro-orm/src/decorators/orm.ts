import {MikroORM} from "@mikro-orm/core";
import {Inject, inject} from "@tsed/di";

import {MikroOrmRegistry} from "../services/MikroOrmRegistry.js";

/**
 * Get the ORM for the given context name using new inject() function.
 * @param contextName
 */
export function orm(contextName?: string): MikroORM | undefined {
  return inject(MikroOrmRegistry).get(contextName);
}

/**
 * Get the ORM for the given context name.
 * @param {String} contextName
 */
export const Orm = (contextName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, {transform: (registry: MikroOrmRegistry) => registry.get(contextName)}) as PropertyDecorator;
