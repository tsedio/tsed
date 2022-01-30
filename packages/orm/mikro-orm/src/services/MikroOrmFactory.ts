import {DBContext} from "./DBContext";
import {MikroORM, Options} from "@mikro-orm/core";
import {Inject, Injectable} from "@tsed/di";

@Injectable()
export class MikroOrmFactory {
  @Inject()
  private readonly dbContext!: DBContext;

  public create(options: Options): Promise<MikroORM> {
    return MikroORM.init({
      ...options,
      context: (name: string) => this.dbContext.get(name)
    });
  }
}
