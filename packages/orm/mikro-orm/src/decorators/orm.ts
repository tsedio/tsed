import {MikroOrmRegistry} from "../services";
import {Inject} from "@tsed/di";

/**
 * @deprecated Since 2022-02-01. Use {@link Orm} instead
 */
export const Connection = (contextName?: string): PropertyDecorator => Orm(contextName);

export const Orm = (contextName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, (registry: MikroOrmRegistry) => registry.get(contextName)) as PropertyDecorator;
