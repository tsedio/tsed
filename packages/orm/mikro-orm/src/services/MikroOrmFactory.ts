import type {Options} from "@mikro-orm/core";
import {MikroORM} from "@mikro-orm/core";
import {Inject, Injectable} from "@tsed/di";

import {MikroOrmContext} from "./MikroOrmContext.js";

@Injectable()
export class MikroOrmFactory {
  constructor(@Inject(MikroOrmContext) private readonly context: MikroOrmContext) {}

  public create(options: Options): Promise<MikroORM> {
    return MikroORM.init({
      ...options,
      context: (name: string) => this.context.get(name)
    });
  }
}
