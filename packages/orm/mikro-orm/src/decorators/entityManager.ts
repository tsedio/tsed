import {Inject} from "@tsed/di";
import {MikroOrmRegistry} from "../services";

/**
 * Get the entity manager for the given connection name.
 * @param connectionName
 * @decorator
 * @mikroOrm
 */
export const EntityManager = (connectionName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, (registry: MikroOrmRegistry) => registry.get(connectionName)?.em) as PropertyDecorator;

/**
 * Get the entity manager for the given connection name.
 * @param connectionName
 * @decorator
 * @mikroOrm
 */
export const Em = EntityManager;
