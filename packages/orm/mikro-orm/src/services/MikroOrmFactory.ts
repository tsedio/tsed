import {MikroORM, Options} from "@mikro-orm/core";
import {Inject, Injectable} from "@tsed/di";
import {MikroOrmEntityManagers} from "./MikroOrmEntityManagers";

@Injectable()
export class MikroOrmFactory {
  constructor(@Inject() private readonly managers: MikroOrmEntityManagers) {}

  public create(options: Options): Promise<MikroORM> {
    return MikroORM.init({
      ...options,
      context: (name: string) => this.managers.get(name)
    });
  }
}
