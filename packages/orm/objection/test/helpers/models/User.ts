import {Groups, MaxLength, MinLength, Required} from "@tsed/schema";
import {Model} from "objection";

import {Entity, IdColumn} from "../../../src/index.js";

@Entity("users")
export class User extends Model {
  @IdColumn()
  @Groups("!creation")
  id: number;

  @Required()
  @MinLength(1)
  @MaxLength(25)
  name: string;
}
