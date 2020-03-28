import {Property} from "../../src/decorators/common/property";
import {User} from "./User";

export class Post {
  @Property()
  id: string;

  @Property()
  owner: User;
}
