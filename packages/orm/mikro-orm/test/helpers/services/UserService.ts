import {EntityManager, MikroORM} from "@mikro-orm/core";
import {Injectable} from "@tsed/di";

import {Em, Orm, Transactional} from "../../../src/index.js";
import {User} from "../entity/User.js";

@Injectable()
export class UserService {
  @Orm()
  orm!: MikroORM;

  @Orm("db1")
  orm1!: MikroORM;

  @Orm("db2")
  orm2!: MikroORM;

  @Em()
  em!: EntityManager;

  @Em("db1")
  em1!: EntityManager;

  @Em("db2")
  em2!: EntityManager;

  @Em("db3")
  em3!: EntityManager;

  @Transactional()
  create(data: {email: string}): Promise<User> {
    return Promise.resolve(this.orm.em.create(User, data));
  }
}
