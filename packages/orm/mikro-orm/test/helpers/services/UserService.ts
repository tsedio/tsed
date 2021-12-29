import {Injectable} from "@tsed/di";
import {Connection} from "../../../src";
import {MikroORM} from "@mikro-orm/core";

@Injectable()
export class UserService {
  @Connection()
  connection!: MikroORM;

  @Connection("db1")
  connection1!: MikroORM;

  @Connection("db2")
  connection2!: MikroORM;
}
