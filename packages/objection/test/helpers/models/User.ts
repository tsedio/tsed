import {Entity} from "@tsed/objection";
import {MaxLength, MinLength, Required} from "@tsed/schema";
import {Model} from "objection";
import {IdColumn} from "../../../src/decorators/idColumn";

@Entity("users")
export class User extends Model {
  @IdColumn()
  id: number;

  @Required()
  @MinLength(1)
  @MaxLength(25)
  name: string;
}