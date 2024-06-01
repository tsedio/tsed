import {MikroOrmRegistry} from "../services/MikroOrmRegistry.js";
import {Inject} from "@tsed/di";

/**
 * Get the ORM for the given context name.
 * @param {String} contextName
 */
export const Orm = (contextName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, (registry: MikroOrmRegistry) => registry.get(contextName)) as PropertyDecorator;
