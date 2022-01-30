import {MikroOrmRegistry} from "../services";
import {Inject} from "@tsed/di";

/**
 * Get the ORM for the given context name.
 * @param {String} contextName
 */
export const Orm = (contextName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, (registry: MikroOrmRegistry) => registry.get(contextName)) as PropertyDecorator;

/**
 * Get the ORM for the given context name.
 * @param {String} contextName
 * @deprecated Since 2022-02-01. Use {@link Orm} instead
 */
export const Connection = Orm;
