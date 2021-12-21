import {DBContext} from "./DBContext";
import {MikroORM, Options} from "@mikro-orm/core";
import {Inject, Injectable} from "@tsed/di";

@Injectable()
export class MikroOrmFactory {
  @Inject()
  private readonly dbContext!: DBContext;

  public create(connectionOptions: Options): Promise<MikroORM> {
    return MikroORM.init({
      ...connectionOptions,
      context: (name: string) => this.dbContext.get(name)
    });
  }
}
