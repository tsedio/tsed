import {Inject} from "@tsed/di";
import {MikroOrmRegistry} from "../services";

/**
 * Get the entity manager for the given context name.
 * @param {String} contextName
 * @decorator
 * @mikroOrm
 */
export const EntityManager = (contextName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, (registry: MikroOrmRegistry) => registry.get(contextName)?.em) as PropertyDecorator;

/**
 * Get the entity manager for the given context name.
 * @param {String} connectionName
 * @decorator
 * @mikroOrm
 */
export const Em = EntityManager;
