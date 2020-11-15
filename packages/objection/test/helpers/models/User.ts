import {Required, MinLength, MaxLength, Inject} from "@tsed/common";
import {Entity} from "@tsed/objection";
import {Model} from 'objection';

@Entity("users")
export class User extends Model {
  id: number
  @Required()
  @MinLength(1)
  @MaxLength(25)
  name: string;
}