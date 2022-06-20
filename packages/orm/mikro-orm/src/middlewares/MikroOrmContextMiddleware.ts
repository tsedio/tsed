import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Inject} from "@tsed/di";
import {MikroOrmRegistry} from "../services/MikroOrmRegistry";
import {Context} from "@tsed/common";
import {MikroOrmEntityManagers} from "../services/MikroOrmEntityManagers";

@Middleware()
export class MikroOrmContextMiddleware implements MiddlewareMethods {
  constructor(@Inject() private readonly store: MikroOrmEntityManagers, @Inject() private readonly registry: MikroOrmRegistry) {}

  public use(@Context() ctx: Context): void {
    const instances = [...this.registry.values()];
    const entityManagers = instances.map((orm) => orm.em);

    this.store.set(entityManagers);
  }
}
