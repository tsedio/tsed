import {Injectable} from "@tsed/di";
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {Connection, Em} from "../../../src";

@Injectable()
export class UserService {
  @Connection()
  connection!: MikroORM;

  @Connection("db1")
  connection1!: MikroORM;

  @Connection("db2")
  connection2!: MikroORM;

  @Em()
  em!: EntityManager;

  @Em("db1")
  em1!: EntityManager;

  @Em("db2")
  em2!: EntityManager;

  @Em("db3")
  em3!: EntityManager;
}
