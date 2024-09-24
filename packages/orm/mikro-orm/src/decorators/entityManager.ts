import {Inject} from "@tsed/di";

import {MikroOrmRegistry} from "../services/MikroOrmRegistry.js";
import {orm} from "./orm.js";

export function entityManager(contextName?: string) {
  return orm(contextName)?.em;
}

/**
 * Get the entity manager for the given context name.
 * @param {String} contextName
 * @decorator
 * @mikroOrm
 */
export const EntityManager = (contextName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, {transform: (registry: MikroOrmRegistry) => registry.get(contextName)?.em}) as PropertyDecorator;

/**
 * Get the entity manager for the given context name.
 * @param {String} connectionName
 * @decorator
 * @mikroOrm
 */
export const Em = EntityManager;
