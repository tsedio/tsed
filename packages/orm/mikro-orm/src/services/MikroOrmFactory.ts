import {MikroORM, Options} from "@mikro-orm/core";
import {Inject, Injectable} from "@tsed/di";
import {MikroOrmEntityManagers} from "./MikroOrmEntityManagers";

@Injectable()
export class MikroOrmFactory {
  constructor(@Inject() private readonly entityManagerStore: MikroOrmEntityManagers) {}

  public create(options: Options): Promise<MikroORM> {
    return MikroORM.init({
      ...options,
      context: (name: string) => this.entityManagerStore.get(name)
    });
  }
}
