import {MikroOrmRegistry} from "../services";
import {Inject} from "@tsed/di";

export const Connection = (connectionName?: string): PropertyDecorator =>
  Inject(MikroOrmRegistry, (registry: MikroOrmRegistry) => registry.get(connectionName)) as PropertyDecorator;
