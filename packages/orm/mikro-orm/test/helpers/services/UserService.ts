import {Injectable} from "@tsed/di";
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {Orm, Em, Transactional} from "../../../src/index";
import {User} from "../entity/User";

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
  async create(data: {email: string}): Promise<User> {
    return this.orm.em.create(User, data);
  }
}
